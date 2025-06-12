import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  signature: {
    border: "1px solid white",
    padding: "10px",
    fontSize: "0.7500rem",
  },
});

class InvoiceSignature extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.signature}>
        {this.props.title}
        <table >
          <tbody>
            <tr>
              <td>Name</td>
              <td> :</td>
              <td>________________________</td>
            </tr>
            <tr>
              <td>Signature </td>
              <td> :</td>
              <td>________________________</td>
            </tr>
            <tr>
              <td>Date </td>
              <td> :</td>
              <td>_______/_______/_________</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceSignature);
