import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  signature: {
    border: "1px solid black",
    padding: "10px",
    fontSize: "0.7500rem"
  },
  row_val: {}
});

class InvoiceSignature extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.signature}>
        {this.props.mainLabel}

        <table width="50%">
          <tbody>
            <tr>
              <td nowrap="true">Name</td>
              <td> :</td>
              <td nowrap="true">---------------------------</td>
            </tr>

            <tr>
              <td className={classes.row_val} nowrap="true">
                Position
              </td>
              <td className={classes.row_val}>:</td>
              <td className={classes.row_val} nowrap="true">
              ---------------------------
              </td>
            </tr>

            <tr>
              <td className={classes.row_val} nowrap="true">
                Signature
              </td>
              <td className={classes.row_val}>:</td>
              <td className={classes.row_val} nowrap="true">
              ---------------------------
              </td>
            </tr>

            <tr>
              <td nowrap="true">Date (dd/mm/yyyy): </td>
              <td> :</td>
              <td nowrap="true">-------/-------/-----------</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceSignature);