import React from "react";
import project from "../Project";
import {
  Dhis2Formula,
  HesabuFormula,
  Dhis2Input,
  DatePeriods,
  CompleteDataSetButton,
  toOrgUnitFacts,
  DecisionTable,
} from "@blsq/blsq-report-components";
import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  header: {
    fontWeight: "bold",
  },
  truncate: {
    minWidth: "500px",
    whiteSpace: "wrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const withRounding = (val) => {
  if (val === undefined) {
    return "";
  } else {
    return val.toFixed(2);
  }
};

const DEFAULT_COMBO = ".HllvX50cXC0";

const QuantityForm = (props) => {
  const classes = useStyles(props);
  const { t, period, dataEntryCode, formData, dataEntryType } = props;
  const projectDescriptor = project(period);
  const payment_rule =
    projectDescriptor.payment_rules[dataEntryType.hesabuPayment];
  const hesabuPackage = payment_rule.packages[dataEntryType.hesabuPackage];

  const currentUser = useSelector((state) => state.currentUser.profile);

  let activities = hesabuPackage.activities.filter((activity) => {
    const visibleValue = formData.getCalculatedValue(
      hesabuPackage,
      "visible",
      period,
      formData.orgUnit,
      activity
    );
    // some exception in kalehe in 2023 couldn't be expressed based on the visible property
    // because it would have implied a huge decision table
    // so we have set the price to 0
    const prixUnitaireValue = formData.getCalculatedValue(
      hesabuPackage,
      "prix_unitaire",
      period,
      formData.orgUnit,
      activity
    );
    return (
      (visibleValue == "1" || visibleValue == undefined) &&
      prixUnitaireValue != 0
    );
  });

  const showIndex = dataEntryType.showIndex;
  const totalExpression =
    "#{" +
    hesabuPackage.formulas[dataEntryType.hesabuTotal].de_id +
    DEFAULT_COMBO +
    "}";
  const calculations = [
    {
      orgUnitId: formData.orgUnit.id,
      period: period,
      currentUserId: currentUser.id,
    },
  ];
  // keep backward compatibility ex pmns doesn't have decision table yet
  if (
    hesabuPackage.activity_decision_tables.some((dt) =>
      dt.out_headers.includes("order")
    )
  ) {
    activities = activities.sort((a, b) => {
      const orderA = formData.getCalculatedValue(
        hesabuPackage,
        "order",
        period,
        formData.orgUnit,
        a
      );
      const orderB = formData.getCalculatedValue(
        hesabuPackage,
        "order",
        period,
        formData.orgUnit,
        b
      );
      if (orderA > orderB) {
        return 1;
      } else if (orderA < orderB) {
        return -1;
      }
      return 0;
    });
  }

  const completable =
    formData.getCalculatedValue(
      hesabuPackage,
      "completable",
      period,
      formData.orgUnit
    ) == 1;

  return (
    <div>
      <h2>
        {props.formData.dataSet.name} -{" "}
        {DatePeriods.displayName(period, "monthYear")}
      </h2>
      <br></br>
      <table className={"table-striped"}>
        <thead>
          <tr>
            {showIndex && (
              <th width={"2%"}>
                {" "}
                <Typography className={classes.header}>#</Typography>
              </th>
            )}
            <th width={"5%"}>
              <Typography className={classes.header}>Service</Typography>
            </th>
            <th width={"5%"}>
              <Typography className={classes.header}>Declared</Typography>
            </th>
            <th width={"5%"}>
              <Typography className={classes.header}>Verified</Typography>
            </th>
            <th width={"5%"}>
              <Typography className={classes.header}>Error margin</Typography>
            </th>
            <th width={"5%"}>
              <Typography className={classes.header}>Unit price</Typography>
            </th>
            <th width={"5%"}>
              <Typography className={classes.header}>Amount</Typography>
            </th>
            <th width={"50%"}></th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={"activity-" + index}>
              {showIndex && (
                <td>
                  <Typography>{index + 1}</Typography>
                </td>
              )}
              <td>
                <Typography
                  title={activity.name + "\n" + activity.code}
                  className={classes.truncate}
                >
                  {formData.getCalculatedValue(
                    hesabuPackage,
                    "new_name",
                    period,
                    formData.orgUnit,
                    activity
                  ) || activity.name}
                </Typography>
              </td>
              <td>
                <Dhis2Input dataElement={activity.declared + DEFAULT_COMBO} />
              </td>
              <td>
                <Dhis2Input dataElement={activity.verified + DEFAULT_COMBO} />
              </td>
              <td>
                <HesabuFormula
                  hesabuPackage={hesabuPackage}
                  formulaCode="error_margin"
                  activity={activity}
                  period={period}
                  formatter={withRounding}
                />
              </td>
              <td>
                <HesabuFormula
                  hesabuPackage={hesabuPackage}
                  formulaCode="prix_unitaire"
                  activity={activity}
                  period={period}
                />
              </td>
              <td>
                <HesabuFormula
                  hesabuPackage={hesabuPackage}
                  formulaCode="subsides"
                  activity={activity}
                  period={period}
                  formatter={withRounding}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>Simulation with modifications</td>

            <td>
              <HesabuFormula
                bold
                hesabuPackage={hesabuPackage}
                formulaCode={dataEntryType.hesabuTotal}
                period={period}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>Currently in dhis2</td>

            <td>
              <Dhis2Formula
                formula={totalExpression}
                formatter={withRounding}
              />
            </td>
          </tr>
          <tr>
            <td>
              <CompleteDataSetButton
                calculations={calculations}
                completable={completable}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default QuantityForm;
