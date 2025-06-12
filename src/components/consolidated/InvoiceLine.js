import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Cell } from "@blsq/blsq-report-components";

const styles = theme => ({
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#eeeeee !important"
    }
  },
  cellLeft: {
    textAlign: "left",
    fontSize: "0.7500rem",
    padding: "0px 0px 0px 3px",
    border: "0.5pt solid black"
  },
  customLink: {
    color: "inherit",
    textDecoration: "inherit"
  }
});

class InvoiceLine extends Component {
  render() {
    const { classes, orgUnits, payment } = this.props;

    return (
      <React.Fragment>
         {orgUnits.map((line, index) => (
            <tr className={classes.row} >
              <Cell value={index + 1} variant="order" field="self" width="1%" />
              <td className={classes.cellLeft}>
                    <a
                      className={classes.customLink}
                      href={
                        "./index.html#/reports/" +
                        line.period +
                        "/" +
                        line.id +
                        "/" +
                        line.invoiceCode
                      }
                    >
                      {line.name}
                    </a>
              </td>
              <Cell value={line} field="paymentRule" variant="money" bold />
            </tr>
          ))}

          <Cell value="TOTAL" field="self" variant="text" colSpan="2" bold={true} />
          <Cell value={payment} field="self" variant="money" bold />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(InvoiceLine);
