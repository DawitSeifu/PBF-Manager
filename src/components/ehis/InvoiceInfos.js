import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DatePeriods } from "@blsq/blsq-report-components";
import Grid from "@material-ui/core/Grid";
import logo from "../../data/logo.png";
import Invoices from "../Invoices";

const styles = {
  center: {
    textAlign: "center",
  },
  imageSize: {
    height: "60px",
  },
  headerLabelsTable: {
    fontSize: "0.7500rem",
    fontWeight: "400",
  },
  headerLabels: {
    fontSize: "0.7500rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  customLink: {
    color: "inherit",
    textDecoration: "inherit",
  },
};

const Ancestor = ({ orgUnit, classes, label, index, period }) => {
  if (orgUnit.ancestors[index] == undefined) {
    return <React.Fragment />;
  }

  return (
    <tr>
      <td>{label}</td>
      <td className={classes.headerLabels}>
        <a
          className={classes.customLink}
          href={
            "./index.html#select?q=" +
            orgUnit.ancestors[index].name +
            "&period=" +
            DatePeriods.split(period, "quarterly")[0]
          }
        >
          {" "}
          : {orgUnit.ancestors[index].name}
        </a>
      </td>
    </tr>
  );
};

class InvoiceInfos extends Component {
  render() {
    const orgUnit = this.props.orgUnit;
    const period = this.props.period;
    const classes = this.props.classes;
    return (
      <div>
        <div>
          <br />
          <table width="100%">
            <tbody>
              <tr>
                <td className={classes.center}><b>EHIS Branch</b></td>
                <td className={classes.center}><b>{orgUnit.ancestors[2] === undefined || orgUnit.ancestors[2].id === orgUnit.id
                  ? "" : "Zone"}</b></td>
                <td className={classes.center}><b>Region</b></td>
              </tr>
              <tr>
                <td className={classes.headerLabels}> {orgUnit.name + " EHIS"}</td>
                <td className={classes.headerLabels}>
                  {orgUnit.ancestors[2] === undefined || orgUnit.ancestors[2].id === orgUnit.id
                    ? "" : orgUnit.ancestors[2].name}
                </td>
                <td className={classes.headerLabels}>
                  {orgUnit.ancestors[2] === undefined
                    ? "" : orgUnit.ancestors[1].name}
                </td>
              </tr>
              <br></br>
              <tr>
                <td className={classes.center}><b>Period</b></td>
                <td className={classes.center}><b>Facility Type</b></td>
                <td className={classes.center}><b>Generated at</b></td>
              </tr>
              <tr>
                <td className={classes.headerLabels}>
                  {" "}
                  {" "}
                  {DatePeriods.displayName(
                    this.props.period,
                    this.props.invoiceType.periodFormat === undefined
                      ? "quarter"
                      : this.props.invoiceType.periodFormat
                  ) +
                    " " +
                    (this.props.invoiceType.periodFormat === "month"
                      ? this.props.year
                      : "")}
                </td>
                <td className={classes.headerLabels}>
                  {this.props.invoiceType.facilityLabel}
                </td>
                <td className={classes.headerLabels}>
                  {" "}
                  {this.props.generatedAt.toLocaleString()}{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div >
    );
  }
}

export default withStyles(styles)(InvoiceInfos);
