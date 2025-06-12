import XlsxPopulate from "./XlsPopulate";

// prettier-ignore
export const bankColumns = () => [
  { field: "nomDeLaBanque", name: "Nom de la Banque" },
  { field: "agenceDeBanque", name: "Agence"},
  { field: "accountNumber", name: "N° de Compte" },
]

// prettier-ignore
export const defaultColumns = () => [
  { field: "index", name: "N°", width: 5,formatter: (value, columns, orgUnit, index) => index + 1, },
  { field: "orgUnitId", name: "orgUnitId", width: 12, formatter: (value, columns, orgUnit) => orgUnit.id, },
  { field: "orgUnitName", name: "DPS", width: 30, formatter: (value, columns, orgUnit) => orgUnit.ancestors && orgUnit.ancestors[1].name, },
  { field: "orgUnitName", name: "Zone de Sante", width: 30, formatter: (value, columns, orgUnit) => orgUnit.ancestors && orgUnit.ancestors[2].name, },
  { field: "orgUnitName", name: "Formation Sanitaire", width: 50, formatter: (value, columns, orgUnit) => orgUnit.name, },
  { field: "contract", name: "Evaluation d'impact", width: 20, formatter: (value, columns, orgUnit) => orgUnit.activeContracts && orgUnit.activeContracts[0].fieldValues.evaluation_d_impact, },
  { field: "contract", name: "Catégorie d'équité", width: 20, formatter: (value, columns, orgUnit) => orgUnit.activeContracts && orgUnit.activeContracts[0].fieldValues.equite_fbr, },
  { field: "contract", name: "AAP", width: 20, formatter: (value, columns, orgUnit) => orgUnit.activeContracts && orgUnit.activeContracts[0].fieldValues.fbp_aap, },
];

export const with2Decimals = (value) => {
  if (value === " " || value === "" || value === undefined) {
    return undefined;
  }
  const roundedValue = parseFloat(value).toFixed(2);
  const formattedValue = parseFloat(roundedValue);
  return formattedValue;
};

function toColumnLetter(n) {
  var ordA = "a".charCodeAt(0);
  var ordZ = "z".charCodeAt(0);
  var len = ordZ - ordA + 1;

  var s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s.toUpperCase();
}

export const asExcel = (request, invoice, columns) => {
  return async () => {
    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    const header = sheet.cell("A1");
    header.value([columns.map((c) => c.name)]);
    workbook.sheet(0).row(1).height(50);
    const rows = (invoice.allOrgUnits || invoice.orgUnits).map(
      (orgUnit, index) => {
        const row = [];
        columns.forEach((column) => {
          let value = orgUnit[column.field]
            ? orgUnit[column.field].value
            : undefined;
          if (column.formatter) {
            value = column.formatter(value, columns, orgUnit, index);
          }
          row.push(value);
        });

        return row;
      }
    );

    const r = sheet.cell("A2");
    r.value(rows);
    columns.forEach((column, index) => {
      const columnLetter = toColumnLetter(index);
      if (column.width) {
        sheet.column(columnLetter).width(column.width);
      }

      sheet.cell(columnLetter + "1").style({ bold: true, wrapText: true });
    });

    XlsxPopulate.openAsBlob(
      workbook,
      invoice.invoiceType.code +
        "-" +
        request.period +
        "-" +
        request.orgUnit.name +
        ".xlsx"
    );
  };
};
