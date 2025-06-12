import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { NumberFormatter } from "@blsq/blsq-report-components";
import writtenNumber from "written-number";

const styles = {};
class TotalInWords extends Component {
  render() {
    const total = isNaN(this.props.amount)
      ? 0
      : NumberFormatter.roundedAmount(this.props.amount, 2);

    var numarray = total.toString().split(".");

    return (
      <Typography variant="body2">
        Arrêté la présente facture pour <b>{this.props.orgUnit}</b> à la somme
        de:{" "}
        <b>
          {writtenNumber(numarray[0], {
            lang: "fr"
          })}
          &nbsp;US$ et&nbsp;
          {writtenNumber((numarray[1] && numarray[1].substring(0, 2)) || 0, {
            lang: "fr"
          })}
          &nbsp;cents.
        </b>
      </Typography>
    );
  }
}

export default withStyles(styles)(TotalInWords);
