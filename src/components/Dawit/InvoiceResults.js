import React from "react";
import { Cell } from "@blsq/blsq-report-components";
import "./style.css";
import { withTranslation } from "react-i18next";
import { DatePeriods } from "@blsq/blsq-report-components";

const QuantityResults = props => {
  const { classes, invoice, t, i18n } = props;
  const renderer = value => {
    let translation = i18n.store.data.en.activity[value.normalizedCode];
    if (i18n.language == "fr") {
      translation = value.normalizedName;
    }

    return (
      <span title={value.normalizedCode + "\n" + value.normalizedName}>
        {translation === value.normalizedCode || translation === undefined
          ? value.normalizedName
          : translation}
      </span>
    );
  };
  let monthInvoiceCode
  if (invoice.invoiceType.code == "hc-quarterly") {
    monthInvoiceCode = "hc-monthly"
  } else if (invoice.invoiceType.code == "hp-quarterly") {
    monthInvoiceCode = "hp-monthly"
  } else if (invoice.invoiceType.code == "hosp-quarterly") {
    monthInvoiceCode = "hosp-monthly"
  }
  return (
    <table className={classes.invoiceTable} id="invoiceTable">
      <thead>
        <tr>
          <Cell
            element="th"
            value={t("invoice:Description")}
            field="self"
            variant="title"
            width="40%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:Amount")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
        </tr>
      </thead>
      <tbody>
                <tr>
          <Cell
            element="td"
            value="Total Quarterly Payment (ETB)"
            field="self"
            variant="text"
            width="15%"
            bold={true}
          />
          <Cell
            value={invoice}
            field="totals.total_payment"
            variant="money"
            width="3%"
            bold={true}
          />
        </tr>
      </tbody>
    </table>
  );
};

export default withTranslation()(QuantityResults);
