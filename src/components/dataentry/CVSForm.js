import React from "react";
import project from "../Project"
import {
    Dhis2Formula,
    HesabuFormula,
    Dhis2Input,
    DatePeriods,
    CompleteDataSetButton,
} from "@blsq/blsq-report-components";
import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import EditIasoFormButton from "./EditIasoFormButton"
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


const withRounding = (val) => {
    if (val === undefined) {
        return ""
    } else {
        return val.toFixed(2)
    }
}

const DEFAULT_COMBO = ".HllvX50cXC0"

const QuantityForm = (props) => {
    const classes = useStyles(props);
    const { t, period, dataEntryCode, formData, dataEntryType } = props;
    const projectDescriptor = project(period)
    const payment_rule = projectDescriptor.payment_rules[dataEntryType.hesabuPayment]
    const indexes = dataEntryType.lines
    const hesabuPackage = payment_rule.packages[dataEntryType.hesabuPackage]

    let activities = hesabuPackage.activities

    const showIndex = true
    const currentUser = useSelector((state) => state.currentUser.profile);
    const calculations = [{
        orgUnitId: formData.orgUnit.id,
        period: period,
        currentUserId: currentUser.id
    }]

    const score_evaluation_communautaire = "#{" + hesabuPackage.formulas.score_evaluation_communautaire.de_id + DEFAULT_COMBO + "}"


    return (
        <div>
            <h2>{props.formData.dataSet.name}{" "} - {DatePeriods.displayName(period, "quarter")}</h2>
            <br></br>
            <table>
                <thead>
                    <tr>
                        {showIndex && <th width={"2%"}> <Typography className={classes.header}>#</Typography></th>}
                        <th width={"5%"}>

                            <Typography className={classes.header}>Indicateur</Typography>
                        </th>
                        <th width={"5%"}>
                            <Typography className={classes.header}>Nombre d'échantillons</Typography>
                        </th>
                        <th width={"5%"}>
                            <Typography className={classes.header}>Enquête Communautaire</Typography>
                        </th>

                        <th width={"5%"}>
                            <Typography className={classes.header}>Validation</Typography>
                        </th>
                        <th width={"5%"}>
                            <Typography className={classes.header}>Pourcentage</Typography>
                        </th>
                        <th width={"50%"}>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity, index) => (
                        <tr
                            key={"activity-" + index}
                        >
                            {showIndex && <td><Typography>{index + 1}</Typography></td>}
                            <td>
                                <Typography title={activity.name + "\n" + activity.code} className={classes.truncate}>
                                    {activity.name}
                                </Typography>
                            </td>
                            <td>
                                {activity.echantillons && <Dhis2Input dataElement={activity.echantillons + DEFAULT_COMBO} />}
                            </td>
                            <td>
                                <Dhis2Input dataElement={activity.enquete + DEFAULT_COMBO} />
                            </td>
                            <td>
                                <Dhis2Input dataElement={activity.validee + DEFAULT_COMBO} />
                            </td>
                        </tr>
                    ))}
                    {
                        <tr>
                            <td colSpan={5}>&nbsp;</td>

                            <td>
                                <HesabuFormula
                                    bold
                                    hesabuPackage={hesabuPackage}
                                    formulaCode={"score_evaluation_communautaire"}
                                    period={period}
                                />
                            </td>
                            <td >Simulation avec les modifications</td>
                        </tr>
                        
                    }
                    <tr>
                        <td colSpan={5}>&nbsp;</td>
                        <Dhis2Formula formula={score_evaluation_communautaire}></Dhis2Formula>
                        <td colSpan={1}>Actuellement dans dhis2</td>

                    </tr>
                    <tr>
                        <td colSpan={5}>&nbsp;</td>
                        <td>  <CompleteDataSetButton calculations={calculations} /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
export default QuantityForm;
