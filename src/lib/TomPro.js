import XlsxPopulate from "xlsx-populate";
class TomPro {
  constructor(invoice, formatType, formatTypeRetenue) {
    this.workbook = XlsxPopulate.fromBlankAsync();
    this.invoice = invoice;
    this.formatType = formatType;
    this.formatTypeRetenue = formatTypeRetenue
    this.amountIdentifiers = {
      acompte: "advanceToPay",
      acompteRetenue: "advanceRetenue",
      reliquat: "amountToPay",
      reliquatRetenue: "retenueMeg"
    };
    this.fileHeaders = [
      "Journal",
      "Journal - Libellé	Site",
      "Date Comptable",
      "N° Pièce",
      "Date Pièce",
      "Compte",
      "Tiers",
      "Budget",
      "Catégorie",
      "Financement",
      "Acti",
      "Géo",
      "Débit local",
      "Crédit local",
    ];
    this.initialize = this.initialize();
  }

  initialize() {}

  invoiceRow(orgUnit, formatType) {
    const label =
      "Subsides " +
      formatType +
      " " +
      this.invoice.period +
      " " +
      orgUnit.name; //.replace(/[^a-zA-Z ]/g, "")

    const currentDate = new Date().toLocaleDateString();

    const amountIdentifier = this.amountIdentifiers[formatType]
    const amount = orgUnit[amountIdentifier]

    return [
      "DES1",
      label,
      "01",
      currentDate,
      "0105",
      currentDate,
      orgUnit.codeTompro.value,
      "",
      "3103",
      "21",
      "03",
      "313002",
      "",
      amount.value &&
      amount.value.toFixed
        ? amount.value.toFixed(2)
        : amount.value,
      "",
    ];
  }

  reformatInvoice() {
    const formatedInvoice = [];
    this.invoice.orgUnits.forEach((zone) => {
      zone.zoneOus.forEach((orgUnit) => {
        formatedInvoice.push(this.invoiceRow(orgUnit,this.formatType));
        formatedInvoice.push(this.invoiceRow(orgUnit,this.formatTypeRetenue));
      });
    });

    return formatedInvoice;
  }

  generate() {
    const fileName =
      "Fiche d'importation comptable subsides FOSA " +
      this.invoice.orgUnit.name +
      " " +
      this.formatType +
      " " +
      this.invoice.period;
    const formatedInvoice = this.reformatInvoice();

    return this.workbook
      .then(function (workbook) {
        workbook
          .sheet(0)
          .cell(1, 1)
          .value([
            [
              "Journal",
              "Journal - Libellé",
              "Site",
              "Date Comptable",
              "N° Pièce",
              "Date Pièce",
              "Compte",
              "Tiers",
              "Budget",
              "Catégorie",
              "Financement",
              "Acti",
              "Géo",
              "Débit local",
              "Crédit local",
            ],
          ])
          .style("bold", true);
        workbook.sheet(0).cell(2, 1).value(formatedInvoice);
        ["B", "D", "F", "K", "M", "N", "O"].forEach((columnName) => {
          let maxStringLength = workbook
            .sheet(0)
            .range(columnName + "1:" + columnName + "100")
            .reduce((max, cell) => {
              let value = cell.value();
              if (value === undefined) return max;
              return Math.max(max, value.toString().length);
            }, 0);

          workbook.sheet(0).column(columnName).width(maxStringLength);
        });

        return workbook.outputAsync();
      })
      .then(function (blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      })
      .catch(function (err) {
        alert(err.message || err);
        throw err;
      });
  }
}
export default TomPro;
