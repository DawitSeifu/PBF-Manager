import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import InvoiceInfos from "./InvoiceInfos";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InvoiceLogo from "./InvoiceLogo";

const styles = {
  center: {
    textAlign: "center"
  },
  invoiceHeaderLabels: {
    fontSize: "0.7500rem",
    fontWeight: "bold"
  },
  invoiceHeaderLabelsAmount: {
    fontSize: "0.7500rem",
    fontWeight: "bold",
    textAlign: "right",
    padding: "0px 15px 0px 0px"
  },
  invoiceHeader: {
    fontSize: "0.7500rem",
    fontWeight: "400"
  },
  customLink: {
    color: "inherit",
    textDecoration: "inherit"
  },
  imageSize: {
    height: "80px"
  }
};

class InvoiceHeader extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <div className="header">
        <div>
          <InvoiceLogo
          />
        </div>
        <Grid item xs>
          <div className={classes.center}>
            <Typography variant="headline">
              <b> {this.props.invoiceType.name}</b>
            </Typography>
            {this.props.invoice && this.props.invoice.xls && <button style={{ margin: "30px" }} className="no-print" onClick={this.props.invoice.xls}>Excel</button>}
          </div>
        </Grid>
        <InvoiceInfos
          invoiceType={this.props.invoiceType}
          period={this.props.period}
          year={this.props.year}
          orgUnit={this.props.orgUnit}
          generatedAt={this.props.generatedAt}
        />
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceHeader);
