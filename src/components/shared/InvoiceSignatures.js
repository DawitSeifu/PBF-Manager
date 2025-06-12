import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import InvoiceSignature from "./InvoiceSignature";
import Invoices from "../Invoices";

const styles = theme => ({
  signatures: {
    width: "100%",
    margin: "auto",
    backgroundColor: "#ffffff",
    "font-size": "12pt"
  },
  invoiceTable: {
    width: "95%",
    margin: "auto",
    borderCollapse: "collapse",
    fontSize: "12px",
    border: "1px solid #ffffff",
    tr: {
      border: "1px solid #dddddd",
    },
  },
});

class InvoiceSignatures extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.signatures} id="signatures">
        <table className={classes.invoiceTable} width="100%">
          <tbody>
            <tr >
              <td width="30%">
                <InvoiceSignature title="Requested By" />
              </td>

              <td width="30%">
                <InvoiceSignature title="Data Manager" />
              </td>

              <td width="30%">
                <InvoiceSignature title="Project Controller" />
              </td>
            </tr>
            <tr >
              <td width="30%">
                <InvoiceSignature title="Project coordinator" />
              </td>

              <td width="30%">
                <InvoiceSignature title="Team Leader" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceSignatures);
