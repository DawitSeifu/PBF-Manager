import React from "react";
import { Cell } from "@blsq/blsq-report-components";
import "./style.css";
import { withTranslation } from "react-i18next";
import Totals from "./Totals";

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
  return (
    <table className={classes.invoiceTable} id="invoiceTable">
      <thead>
        <tr>
          <Cell
            element="th"
            value={t("invoice:indicator")}
            field="self"
            variant="text"
            width="15%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:declared")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:validated")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:percent_error")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:unit_price")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:amount")}
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
              <Cell
                value={activity}
                field="descriptor"
                variant="text"
                width="3%"
                renderer={renderer}
              />
              <Cell
                value={activity}
                field={invoice.invoiceType.claimed}
                variant="quantity"
                width="3%"
              />
              <Cell
                value={activity}
                field={invoice.invoiceType.verified}
                variant="quantity"
                width="3%"
              />
              <Cell
                value={activity}
                field="difference_percentage"
                variant="percentage"
                width="3%"
              ></Cell>
              <Cell
                value={activity}
                field="price_unit"
                variant="money"
                width="3%"
                decimals={0}
                separator=" "
              />
              <Cell
                value={activity}
                field="amount"
                variant="money"
                width="3%"
                noWrap="true"
                decimals={0}
                separator=" "
              />
            </tr>
          ))}
        {<Totals totals={invoice.totals}></Totals>}
      </tbody>
    </table>
  );
};

export default withTranslation()(QuantityResults);
