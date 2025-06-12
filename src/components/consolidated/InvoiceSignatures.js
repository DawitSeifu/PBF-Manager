import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import InvoiceSignature from "./InvoiceSignature";

const styles = theme => ({
  signatures: {
    width: "100%",
    margin: "auto",
    backgroundColor: "#ffffff",
    "font-size": "14pt"
  },
});

class InvoiceSignatures extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.signatures} id="signatures">
        <table width="100%">
          <tbody>
            <tr>
              <td>
                <InvoiceSignature mainLabel="Requester: Operations Manager" />
              </td>
              <td>
                <InvoiceSignature mainLabel="Verification:  Finance Manager" />
              </td>
              <td>
                <InvoiceSignature mainLabel="Approval Team Leader" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceSignatures);
