import React from "react";
import { createTheme } from "@material-ui/core/styles";
import DataEntries from "./components/DataEntries";
import OrgUnitsResolver from "./lib/OrgUnitsResolver";
import { configureI18N, DatePeriods } from "@blsq/blsq-report-components";
import Dhis2 from "./lib/Dhis2";
import Invoices from "./components/Invoices";
import BackButton from "./components/shared/BackButton";
import DrawerLinks from "./components/DrawerLinks";
import { Route, Redirect, Link } from "react-router-dom";
import project from "./components/Project";
import TestData from "./components/TestData";
import { routes } from "./components/syncs/routes";
import { Button } from "@material-ui/core";
import moment from "moment";
import incentivesDescriptors from "./data/incentives-descriptors"

import SpecificContractValidator from "./components/contracts/SpecificContractValidator";
import GroupWorkIcon from "@material-ui/icons/GroupWork";

DatePeriods.setDefaultQuarterFrequency("quarterlyNov");

// since dhis2 don't want 31 days in a month...
const originalEndOf = moment.fn.endOf;

moment.fn.endOf = function (unit) {
  const result = originalEndOf.call(this, unit);
  if (unit === "month") {
    this.date(Math.min(30, this.date()));
  }
  return this;
};

const orignalSplit = DatePeriods.split;

// TODO move to blsq-report-components
DatePeriods.split = (period, perioType) => {
  if (perioType == "quarterly_nov") {
    perioType = "quarterlyNov";
  }
  if (perioType == "quarterlynov") {
    perioType = "quarterlyNov";
  }
  if (perioType == "QuarterlyNov") {
    perioType = "quarterlyNov";
  }

  return orignalSplit.call(DatePeriods, period, perioType);
};

//DatePeriods.split.bind(DatePeriods)

const defaultLang = "en";
DatePeriods.setLocale(defaultLang);
const i18n = configureI18N(defaultLang);
i18n.addResourceBundle("en", "translation", {
  report_and_invoices: "Reports & Invoices",
  app_name: "Reports & Invoices",
});
i18n.addResourceBundle(defaultLang, "translation", {
  back_buttom_caption: "Back",
});

DatePeriods.setMonthTranslations([
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahesas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miyazia",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
]);

const BackBtn = (props) => {
  const calc =
    props && props.invoice && props.invoice.calculations
      ? props.invoice.calculations[0]
      : undefined;

  return [
    <BackButton
      orgUnit={props.invoice.orgUnit.id}
      period={props.invoice.period}
    />,
    calc && (
      <Button
        title={"Simulation " + JSON.stringify(props.invoice.calculations)}
        href={
          "https://dhis-pbf.moh.gov.et/api/apps/Hesabu/index.html#/simulation?periods=" +
          calc.period +
          "&orgUnit=" +
          calc.orgUnitId +
          "&displayedOrgUnit=" +
          props.invoice.orgUnit.id
        }
      >
        <GroupWorkIcon></GroupWorkIcon>
      </Button>
    ),
  ];
};

const defaultRoute = (props) => {
  return [
    <Route
      key="testData"
      exact
      path="/testData"
      render={(routerProps) => {
        return <TestData {...props} />;
      }}
    />,
    ...routes(props),
    <Route
      key="redirect default route"
      exact
      path="/"
      render={() => {
        return <Redirect key="defaultSelect" from="/" to="/select" />;
      }}
    />,
  ];
};

const config = {
  global: {
    periodFormat: {
      quarterly: "quarter",
      monthly: "monthYear",
      sixMonthly: "sixMonth",
      yearly: "monthYear",
    },
    levels: ["National", "Regional", "Zonal", "Wereda", "PHCU", "Facilities"],
  },
};

const dhis2 = new Dhis2();

const customTheme = createTheme({
  palette: {
    primary: {
      light: "#5d94c7",
      main: "#266696",
      dark: "#003c68",
      contrastText: "#fff",
    },
    secondary: {
      light: "#5d94c7",
      main: "#266696",
      dark: "#003c68",
      contrastText: "#fff",
    },
  },
});

const EthSpecificPlugin = {
  key: "@blsq/blsq-report-ethiopia-fmoh",
  extensions: {
    "incentives.incentivesDescriptors": [incentivesDescriptors],
    "invoices.invoices": [Invoices],
    "invoices.actions": [BackBtn],
    "contracts.config": [
      {
        programId: "wrqNEHW2Pvx",
        allEventsSqlViewId: "k6WKF6CQjpD",
      },
    ],
    "contracts.validator": [SpecificContractValidator],
    "dataentry.dataEntries": [DataEntries],
    "invoices.orgUnitsResolver": [new OrgUnitsResolver()],
    "invoices.selectionLinks": [
      ({ orgUnit, period }) => (
        <span>
          <Button
            variant="text"
            color="secondary"
            size="small"
            component={Link}
            to={"/contracts/" + orgUnit.id}
          >
            Contracts
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="text"
            color="secondary"
            size="small"
            component={Link}
            to={"/dataEntry/" + orgUnit.id + "/" + period}
          >
            Data Entry
          </Button>
          {orgUnit.level < 4 && (
            <React.Fragment>
              &nbsp;&nbsp;
              <Button
                variant="text"
                color="secondary"
                size="small"
                component={Link}
                to={`/data/${period}/deg/MpDmrTa27O5/${orgUnit.id}/children`}
              >
                Data
              </Button>
            </React.Fragment>
          )}
        </span>
      ),
    ],
    "hesabu.project": [project],
    "browsedata.dataElementGroups": [
      [
        { id: "MpDmrTa27O5", name: "Hesabu - Données Qualité" },
        {
          id: "HQZlHWMJ361",
          name: "008. Evaluation Qualité des Centres de Santé - Critère",
        },
        {
          id: "P9EVdIXsaxb",
          name: "009. Evaluation Qualité des Hopitaux - Critère",
        },
      ],
    ],
    "core.dhis2": [dhis2],
    "core.routes": [defaultRoute],
    "core.drawerLinks": [DrawerLinks],
    "core.config": [config],
    "core.i18n": [i18n],
    "core.theme": [customTheme],
  },
};

export default EthSpecificPlugin;
