import React from "react";
import { Cell } from "@blsq/blsq-report-components";
import "./style.css";
import { withTranslation } from "react-i18next";

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

  invoice.quantity.activities.sort((a, b) => (parseInt(a.descriptor.code.substring(2), 10) < parseInt(b.descriptor.code.substring(2), 10)))
  return (
    <table className={classes.invoiceTable} id="invoiceTable">
      <thead>
        <tr>
          <Cell
            element="th"
            value={t("invoice:#")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:Description")}
            field="self"
            variant="title"
            width="15%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:Validated")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:Price  (ETB)")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:Total Amount  (ETB)")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
        </tr>
      </thead>
      <tbody>
        {invoice.quantity &&
          invoice.quantity.activities.map((activity, index) => (
            <tr key={index}>
              <Cell value={index + 1} field="self" variant="text" width="3%" />
              <Cell
                value={activity}
                field="descriptor.name"
                variant="text"
                width="3%"
              />
              <Cell
                value={activity}
                field="verified"
                variant="quantity"
                width="3%"
              />
              <Cell
                value={activity}
                field="price"
                variant="money"
                width="3%"
              />
              <Cell
                value={activity}
                field="amount"
                variant="money"
                width="3%"
              />
            </tr>
          )
          )}
        <tr>
          <Cell
            element="th"
            value="Total Amount"
            field="self"
            variant="text"
            width="15%"
            bold={true}
            colSpan={4}
          />
          <Cell
            value={invoice}
            field="totals.totalAmount"
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
