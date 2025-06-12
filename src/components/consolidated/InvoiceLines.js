import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import InvoiceLine from "./InvoiceLine";
import { Cell } from "@blsq/blsq-report-components";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: "20px"
  },
  invoiceTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
    border: "0.5pt solid black",
    marginTop: "50px"
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

class InvoiceLines extends Component {
  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <div>
          <table className={classes.invoiceTable} id="invoiceTable">
            <thead>
              <tr>
                <Cell value="#" variant="text" field="self" bold />
                <Cell
                  value="Health facility Name"
                  variant="title"
                  field="self"
                  bold
                />
                <Cell
                  value="Amount"
                  variant="title"
                  field="self"
                  bold
                />
              </tr>
            </thead>
            <tbody>
              <InvoiceLine
                orgUnits={this.props.invoice.orgUnits}
                invoiceType={this.props.invoiceType}
                payment={this.props.invoice.payment}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceLines);
