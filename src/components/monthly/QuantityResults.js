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

  invoice.quantity.activities.sort((a, b) => (parseInt(a.descriptor.code.substring(2), 10) > parseInt(b.descriptor.code.substring(2), 10)) ? 1 : -1)
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
            value={t("invoice:Price  (ETB)")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:Difference %")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:Waiver Yes(1)/No(0)")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
          <Cell
            element="th"
            value={t("invoice:Amount Lost  (ETB)")}
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
                field="declared"
                variant="quantity"
                width="3%"
              />
              <Cell
                value={activity}
                field="validated"
                variant="quantity"
                width="3%"
              />
              <Cell
                value={activity}
                field="unit_price"
                variant="money"
                width="3%"
              />
              <Cell
                value={activity}
                field="error_margin"
                variant="percentage"
                width="3%"
              />
              <Cell
                value={activity}
                field="waiver_status"
                variant="quantity"
                width="3%"
              />
              <Cell
                value={activity}
                field="amount_lost"
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
        {invoice.totals.total_quantity_amount && (
          <tr>
            <Cell
              element="th"
              value="Total Amount"
              field="self"
              variant="text"
              width="15%"
              bold={true}
              colSpan={7}
            />
            <Cell
              value={invoice}
              field="totals.total_amount_lost"
              variant="money"
              width="3%"
              bold={true}
            />
            <Cell
              value={invoice}
              field="totals.total_quantity_amount"
              variant="money"
              width="3%"
              bold={true}
            />
          </tr>
        )}
        {invoice.totals.total_monthly_quantity_amount && (
          <tr>
            <Cell
              element="th"
              value="Total Amount"
              field="self"
              variant="text"
              width="15%"
              bold={true}
              colSpan={7}
            />
            <Cell
              value={invoice}
              field="totals.total_monthly_quantity_amount_lost"
              variant="money"
              width="3%"
              bold={true}
            />
            <Cell
              value={invoice}
              field="totals.total_monthly_quantity_amount"
              variant="money"
              width="3%"
              bold={true}
            />
          </tr>
        )}
        {invoice.totals.hc_hp_amount && (
          <tr>
            <Cell
              element="th"
              value="Total for Health Post"
              field="self"
              variant="text"
              width="15%"
              bold={true}
              colSpan={7}
            />
            <Cell
              value={invoice}
              field="totals.hc_hp_amount_lost"
              variant="money"
              width="3%"
              bold={true}
            />
            <Cell
              value={invoice}
              field="totals.hc_hp_amount"
              variant="money"
              width="3%"
              bold={true}
            />
          </tr>
        )}

        {invoice.totals.total_amount_lost_hp && (
          <tr>
            <Cell
              element="th"
              value="Total for Health Post"
              field="self"
              variant="text"
              width="15%"
              bold={true}
              colSpan={7}
            />
            <Cell
              value={invoice}
              field="totals.total_amount_lost_hp"
              variant="money"
              width="3%"
              bold={true}
            />
            <Cell
              value={invoice}
              field="totals.total_quantity_amount_hp"
              variant="money"
              width="3%"
              bold={true}
            />
          </tr>
        )}
        {invoice.totals.totalAmount && (
          <tr>
            <Cell
              element="th"
              value="Total Quantity Payment"
              field="self"
              variant="text"
              width="15%"
              bold={true}
              colSpan={8}
            />
            <Cell
              value={invoice}
              bold={true}
              field="totals.totalAmount"
              variant="money"
              width="3%"
            />
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default withTranslation()(QuantityResults);
