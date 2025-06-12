import React from "react";
import project from "../Project";
import {
  Dhis2Formula,
  HesabuFormula,
  Dhis2Input,
  DatePeriods,
  CompleteDataSetButton,
  PluginRegistry,
} from "@blsq/blsq-report-components";

import EditIasoFormButton from "./EditIasoFormButton";

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  header: {
    fontWeight: "bold",
  },
  truncate: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const DEFAULT_COMBO = ".HllvX50cXC0";

const withRounding = (val) => {
  if (val === undefined) {
    return "";
  } else {
    return val.toFixed(2);
  }
};

const QualityForm = (props) => {
  const classes = useStyles(props);
  const { t, orgUnit, period, dataEntryCode, formData, dataEntryType } = props;
  const projectDescriptor = project(period);
  const payment_rule =
    projectDescriptor.payment_rules[dataEntryType.hesabuPayment];
  const indexes = dataEntryType.lines;
  const hesabuPackage = payment_rule.packages[dataEntryType.hesabuPackage];

  let activities = hesabuPackage.activities;

  const currentUser = useSelector((state) => state.currentUser.profile);

  const calculations = [
    {
      orgUnitId: formData.orgUnit.id,
      period: period,
      currentUserId: currentUser.id,
    },
  ];

  if (hesabuPackage.formulas[dataEntryType.hesabuScore] == undefined) {
    throw new Error(
      "no such formula '" +
        dataEntryType.hesabuScore +
        "' in " +
        Object.keys(hesabuPackage.formulas).join(" , ")
    );
  }

  const totalExpression =
    "#{" +
    hesabuPackage.formulas[dataEntryType.hesabuScore].de_id +
    DEFAULT_COMBO +
    "}";

  const copyScores = async () => {
    const previousQuarter = DatePeriods.previous(period);
    const dataSetIds = props.formData.dataSets.map((d) => d.id);
    const dhis2 = PluginRegistry.extension("core.dhis2");
    const api = await dhis2.api();
    const previousQuarterDataValues = await api.get("dataValueSets", {
      dataSet: dataSetIds,
      period: previousQuarter,
      orgUnit: props.formData.orgUnit.id,
    });

    const dataElementIds = activities.flatMap((c) => [
      c.points_attribues,
      c.points_maximum,
    ]);

    // keep only the points_attribues and points_maximum
    const valuesToCopy = previousQuarterDataValues.dataValues.filter((dv) =>
      dataElementIds.includes(dv.dataElement)
    );
    // change the period to current
    for (let dv of valuesToCopy) {
      dv.period = period;
    }

    const writeDvResponse = await api.post("dataValueSets", {
      dataValues: valuesToCopy,
    });

    console.log(
      previousQuarterDataValues,
      hesabuPackage,
      valuesToCopy,
      writeDvResponse
    );
    window.location.reload();
  };
  return (
    <div>
      <h2>
        {props.formData.dataSet.name} -{" "}
        {DatePeriods.displayName(period, "monthYear")}
      </h2>

      <table style={{ width: "70%" }} className="table-striped">
        <thead>
          <tr>
            <th width="3%">#</th>
            <th width="20%">Services</th>
            <th width="10%">Points obtenus</th>
            <th width="10%">Points maximum</th>
            <th width="10%">Score %</th>
            <th width="50%"></th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td title={activity.code}>{activity.name}</td>
              {/*   <td> <Dhis2Input dataElement={activity.points_attribues + DEFAULT_COMBO} /></td>     */}
              <td>
                <HesabuFormula
                  hesabuPackage={hesabuPackage}
                  formulaCode="points_qualite_attribues"
                  activity={activity}
                  period={period}
                  formatter={withRounding}
                />
              </td>
              <td>
                <HesabuFormula
                  hesabuPackage={hesabuPackage}
                  formulaCode="points_disponibles"
                  activity={activity}
                  period={period}
                  formatter={withRounding}
                />
              </td>
              <td>
                <HesabuFormula
                  hesabuPackage={hesabuPackage}
                  formulaCode={dataEntryType.hesabuScoreColumn}
                  activity={activity}
                  period={period}
                  formatter={withRounding}
                />
              </td>
              <td>
                {dataEntryType.iasoForms[activity.code] && (
                  <EditIasoFormButton
                    formId={dataEntryType.iasoForms[activity.code]}
                    currentUserId={currentUser.id}
                    period={period}
                    orgUnitId={formData.orgUnit.id}
                  />
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>&nbsp;</td>
            <td>
              <HesabuFormula
                bold
                hesabuPackage={hesabuPackage}
                formulaCode={dataEntryType.hesabuTotalObtenus}
                period={period}
              />
            </td>
            <td>
              <HesabuFormula
                bold
                hesabuPackage={hesabuPackage}
                formulaCode={dataEntryType.hesabuTotalMaximum}
                period={period}
              />
            </td>
            <td>
              <HesabuFormula
                bold
                hesabuPackage={hesabuPackage}
                formulaCode={dataEntryType.hesabuScore}
                period={period}
                formatter={withRounding}
              />
            </td>
            <td>Simulation avec les modifications</td>
          </tr>
          <tr>
            <td colSpan={4}>&nbsp;</td>

            <td>
              <Dhis2Formula formula={totalExpression} />
            </td>
            <td colSpan={2}>Actuellement dans dhis2</td>
          </tr>
          <tr>
            <td colSpan={4}>&nbsp;</td>
            <CompleteDataSetButton calculations={calculations} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default QualityForm;
