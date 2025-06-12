import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceSignatures from "../shared/InvoiceSignatures";
import QuantityResults from "./QuantityResults";

const styles = {
  invoiceTable: {
    width: "95%",
    margin: "auto",
    borderCollapse: "collapse",
    fontSize: "12px",
    border: "1px solid #dddddd",
    tr: {
      border: "1px solid #dddddd"
    }
  },
  invoiceFrame: {
    backgroundColor: "#ffffff",
    padding: "5px"
  },
  hLine: {
    borderBottom: "1px solid black"
  }
};

class Invoice extends Component {
  render() {
    const { classes, invoice } = this.props;
    return (
      <div className={classes.invoiceFrame} id="invoiceFrame">
        <InvoiceHeader
          orgUnit={invoice.orgUnit}
          generatedAt={invoice.generatedAt}
          period={invoice.period}
          totals={invoice.totals}
          invoiceType={invoice.invoiceType}
          showBank={true}
        />
        <br />
        <QuantityResults invoice={invoice} classes={classes} />
        <br />
        <InvoiceSignatures invoice={invoice} />
      </div>
    );
  }
}

export default withStyles(styles)(Invoice);
