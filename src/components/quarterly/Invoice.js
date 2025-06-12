import React, {
  Component
} from "react";
import {
  withStyles
} from "@material-ui/core/styles";
import InvoiceHeader from "../shared/InvoiceHeader";
import InvoiceSignatures from "../shared/InvoiceSignatures";
import InvoiceResults from "./InvoiceResults";
import {
  PluginRegistry
} from "@blsq/blsq-report-components";
import {
  withRouter
} from "react-router-dom";

const styles = {
  invoiceTable: {
    width: "95%",
    margin: "auto",
    borderCollapse: "collapse",
    fontSize: "12px",
    border: "1px solid #dddddd",
    tr: {
      border: "1px solid #dddddd",
    },
  },
  invoiceFrame: {
    backgroundColor: "#ffffff",
    padding: "5px",
  },
  hLine: {
    borderBottom: "1px solid black",
  },
};

class Invoice extends Component {
  render() {
    const classes = this.props.classes;
    const invoice = this.props.invoice;

    return (<div className={classes.invoiceFrame} id="invoiceFrame" >
      <InvoiceHeader
        orgUnit={invoice.orgUnit}
        generatedAt={invoice.generatedAt}
        period={invoice.period}
        totals={invoice.totals}
        invoiceType={invoice.invoiceType}
        showBank={true}
      />
      <br />
      <InvoiceResults invoice={invoice}
        classes={classes}>
      </InvoiceResults>
      <br />
      <InvoiceSignatures invoice={invoice} />
    </div>
    );
  };
}
export default withRouter(withStyles(styles)(Invoice));