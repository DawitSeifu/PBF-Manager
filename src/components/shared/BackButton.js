import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Link } from "@material-ui/core";

class BackButton extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    const { t, orgUnit, period } = this.props;

    return [
      <Button href={"./index.html#contracts/" + orgUnit}>
        {t("contracts.title")}
      </Button>,
      <Button
        href={"./index.html#/dataEntry/" + orgUnit + "/" + period}
      >
        Data entry
      </Button>,
      <Button onClick={this.context.router.history.goBack}>
        {t("back_buttom_caption")}
      </Button>
    ]
  };

}

export default withTranslation()(BackButton);
