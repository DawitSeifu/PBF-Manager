import React from "react";
import project from "../Project"
import {
  Dhis2Formula,
  HesabuFormula,
  Dhis2Input,
  DatePeriods,
  CompleteDataSetButton,
} from "@blsq/blsq-report-components";

import { makeStyles } from "@material-ui/core/styles";
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

const DEFAULT_COMBO = ".HllvX50cXC0"

const withRounding = (val) => {
  if (val === undefined) {
    return ""
  } else {
    return val.toFixed(2)
  }
}

const VignettesForm = (props) => {
  const classes = useStyles(props);
  const { t, orgUnit, period, dataEntryCode, formData, dataEntryType } = props;
  const projectDescriptor = project(period)
  const payment_rule = projectDescriptor.payment_rules[dataEntryType.hesabuPayment]
  const indexes = dataEntryType.lines
  const hesabuPackage = payment_rule.packages[dataEntryType.hesabuPackage]
  const currentUser = useSelector((state) => state.currentUser.profile);
  let activities = hesabuPackage.activities

  const showIndex = true

  const calculations = [{
    orgUnitId: formData.orgUnit.id,
    period: period,
    currentUserId: currentUser.id
  }]

  if (hesabuPackage.formulas[dataEntryType.hesabuScore] == undefined) {
    throw new Error("no such formula '"+dataEntryType.hesabuScore+"' in "+Object.keys(hesabuPackage.formulas).join(" , "))
  }

  const totalExpression = "#{" + hesabuPackage.formulas[dataEntryType.hesabuScore].de_id + DEFAULT_COMBO + "}"
  return (

    <div>
      <h2>{props.formData.dataSet.name}{" "} - {DatePeriods.displayName(period, "monthYear")}</h2>

      <table style={{ width: "70%" }} className="table-striped">
        <thead>
          <tr>
            <th width="3%">#</th>
            <th width="40%">Vignette</th>
            <th width="10%">Points obtenus</th>
            <th width="10%">Score %</th>
            <th width="20%"></th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td title={activity.code}>{activity.name}</td>
              {/*   <td> <Dhis2Input dataElement={activity.points_attribues + DEFAULT_COMBO} /></td>     */}
              <td >
                <Dhis2Input dataElement={activity.score + DEFAULT_COMBO} />
              </td>    
              <td >
                <HesabuFormula
                  hesabuPackage={hesabuPackage}
                  formulaCode={dataEntryType.hesabuScore}
                  activity={activity}
                  period={period}
                  formatter={withRounding}

                />
              </td>              
            </tr>
          ))}
          <tr>
            <td colSpan={2}>&nbsp;</td>      
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
            <td >Simulation avec les modifications</td>
          </tr>
          <tr>
            <td colSpan={3}>&nbsp;</td>


            <td>
              <Dhis2Formula
                formula={totalExpression}
              />
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
  )
}

export default VignettesForm