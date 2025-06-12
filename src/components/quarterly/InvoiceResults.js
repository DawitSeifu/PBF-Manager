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
            value={t("invoice:Value")}
            field="self"
            variant="title"
            width="3%"
            bold={true}
          />
        </tr>
      </thead>
      <tbody>
        {invoice.months.map((month, index) => (
          <tr>
            <Cell
              element="td"
              value={"Quantity Subsidies " + month + " (ETB)"}
              field="self"
              variant="text"
              width="15%"
            />
            <Cell
              element="td"
              value={invoice.totalByMonth[index]}
              field="self"
              variant="money"
              width="15%"
              href={"#/reports/" + invoice.totalByMonth[index].period + "/" + invoice.orgUnit.id + "/" + monthInvoiceCode}
            />
          </tr>
        ))}
        <tr>
          <Cell
            element="td"
            value="Total Quantity Subsidies (ETB)"
            field="self"
            variant="text"
            width="15%"
            bold={true}
          />
          <Cell
            value={invoice}
            field="totals.total_quantity_payment"
            variant="money"
            width="3%"
            bold={true}
          />
        </tr>
        {invoice.totals.equity_ecore && (
          <tr>
            <Cell
              element="td"
              value="Equity %"
              field="self"
              variant="text"
              width="15%"
            />
            <Cell
              value={invoice}
              field="totals.equity_ecore"
              variant="percentage"
              width="3%"
            />
          </tr>
        )}
        {invoice.totals.equity_payment && (
          <tr>
            <Cell
              element="td"
              value="Equity Bonus (ETB)"
              field="self"
              variant="text"
              width="15%"
            />
            <Cell
              value={invoice}
              field="totals.equity_payment"
              variant="money"
              width="3%"
            />
          </tr>
        )}
        {invoice.totals.quantity_plus_equity && (
          <tr>
            <Cell
              element="td"
              value="Total Quantity + Equity bonus (ETB)"
              field="self"
              variant="text"
              width="15%"
              bold={true}
            />
            <Cell
              value={invoice}
              field="totals.quantity_plus_equity"
              variant="money"
              width="3%"
              bold={true}
            />
          </tr>
        )}
        <tr>
          <Cell
            element="td"
            value="Technical Quality Score %"
            field="self"
            variant="text"
            width="15%"
          />
          <Cell
            value={invoice}
            field="totals.technical_quality_score"
            variant="percentage"
            width="3%"
          />
        </tr>
        <tr>
          <Cell
            element="td"
            value="Patient Satisfaction Score %"
            field="self"
            variant="text"
            width="15%"
          />
          <Cell
            value={invoice}
            field="totals.customer_verification_score"
            variant="percentage"
            width="3%"
          />
        </tr>
        <tr>
          <Cell
            element="td"
            value="Total Quality Score %"
            field="self"
            variant="text"
            width="15%"
          />
          <Cell
            value={invoice}
            field="totals.quality_score"
            variant="percentage"
            width="3%"
          />
        </tr>
        <tr>
          <Cell
            element="td"
            value="Quality Payment (ETB)"
            field="self"
            variant="text"
            width="15%"
            bold={true}
          />
          <Cell
            value={invoice}
            field="totals.quality_payment"
            variant="money"
            width="3%"
            bold={true}
          />
        </tr>
        <tr>
          <Cell
            element="td"
            value="Total Quarterly Amount Earned (ETB)"
            field="self"
            variant="text"
            width="15%"
            bold={true}
          />
          <Cell
            value={invoice}
            field="totals.payment_without_fraud"
            variant="money"
            width="3%"
            bold={true}
          />
        </tr>
        <tr>
          <Cell
            element="td"
            value="Irregularity Penalty %"
            field="self"
            variant="text"
            width="15%"
          />
          <Cell
            value={invoice}
            field="totals.fraud_penalty"
            variant="percentage"
            width="3%"
          />
        </tr>
        <tr>
          <Cell
            element="td"
            value="Irregularity Deducted Amount (ETB)"
            field="self"
            variant="text"
            width="15%"
          />
          <Cell
            value={invoice}
            field="totals.fraud_retention_amount"
            variant="money"
            width="3%"
          />
        </tr>
        {invoice.totals.total_before_managed_facilities_fraud && (
          <tr>
            <Cell
              element="td"
              value="Total Payment Before HP Deductions (ETB)"
              field="self"
              variant="text"
              width="15%"
              bold={true}
            />
            <Cell
              value={invoice}
              field="totals.total_before_managed_facilities_fraud"
              variant="money"
              width="3%"
              bold={true}
            />
          </tr>
        )}
        {invoice.totals.facilities_managed_fraud && (
          <tr>
            <Cell
              element="td"
              value="Percent of HPs that commited fraud %"
              field="self"
              variant="text"
              width="15%"
            />
            <Cell
              value={invoice}
              field="totals.facilities_managed_fraud"
              variant="percentage"
              width="3%"
            />
          </tr>
        )}
        {invoice.totals.managed_facilities_fraud_retention && (
          <tr>
            <Cell
              element="td"
              value="Irregularity Deducted Amount for HP fraud (ETB)"
              field="self"
              variant="text"
              width="15%"
            />
            <Cell
              value={invoice}
              field="totals.managed_facilities_fraud_retention"
              variant="money"
              width="3%"
            />
          </tr>
        )}
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
