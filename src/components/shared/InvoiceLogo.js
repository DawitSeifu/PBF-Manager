import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import logo from "../../data/logo.png";


const styles = {
  center: {
    textAlign: "center",
    fontSize: "16px"
  },
  imageSize: {
    height: "80px"
  }
};

class InvoiceLogo extends Component {
  render() {
    const classes = this.props.classes;
    return (
      <div className="header">
        <div>
          <table width="100%">
            <tr>
              <td className={classes.center} width="20%">
                <div className={classes.center}>
                  <img src={logo} alt="" className={classes.imageSize} />
                </div>
              </td>
              <td className={classes.center} width="60%">
                <div className={classes.center}>
                </div>
              </td>
              <td className={classes.center} width="20%">
                <div className={classes.center}>
                  <img src={logo} alt="" className={classes.imageSize} />
                </div>
              </td>
            </tr>
          </table>
        </div>
        <br />
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceLogo);
