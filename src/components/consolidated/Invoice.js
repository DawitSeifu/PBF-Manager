import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import InvoiceHeader from "../shared/InvoiceHeader";
import InvoiceLines from "./InvoiceLines";
import InvoiceSignatures from "./InvoiceSignatures";

const styles = {
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
    const classes = this.props.classes;

    return (
      <div className={classes.invoiceFrame} id="invoiceFrame">
        <InvoiceHeader
          orgUnit={this.props.invoice.orgUnit}
          generatedAt={this.props.invoice.generatedAt}
          period={this.props.invoice.period}
          totals={this.props.invoice.totals}
          invoiceType={this.props.invoice.invoiceType}
        />
        <InvoiceLines
          invoice={this.props.invoice}
          totals={this.props.invoice.totals}
          months={this.props.invoice.months}
          invoiceType={this.props.invoice.invoiceType}
        />
        <br />
        <InvoiceSignatures invoice={this.props.invoice} />
        <p style={{ float: "right" }}>
          Printed on. : {this.props.invoice.generatedAt.toLocaleString()}
        </p>
        <br />
      </div>
    );
  }
}

export default withStyles(styles)(Invoice);
