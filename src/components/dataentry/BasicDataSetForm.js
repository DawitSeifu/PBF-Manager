import React from "react";

import {
    Dhis2Input,
    CompleteDataSetButton,
    DatePeriods
} from "@blsq/blsq-report-components";
import { useSelector } from "react-redux";

const BasicDataSetForm = props => {
    const { t, orgUnit, period, dataEntryCode, formData, dataEntryType } = props;

    const currentUser = useSelector((state) => state.currentUser.profile);
    const calculations = [{
        orgUnitId: formData.orgUnit.id,
        period: period,
        currentUserId: currentUser.id
    }]

    const dataElements = formData.dataSet.dataSetElements.map(d => d.dataElement)
    dataElements.sort((a, b) => a.name.localeCompare(b.name))

    return <div>
        <h2>{props.formData.dataSet.name}{" "} - {DatePeriods.displayName(period, "monthYear")}</h2>
        <table className="table-striped">
            <tbody>
                {dataElements.map((dataElement, index) =>

                    <tr>
                        <td width="20px">{index + 1}</td>
                        <td title={dataElement.id}>{dataElement.name}</td>
                        <td ><Dhis2Input dataElement={dataElement.id}/></td>
                    </tr>

                )}

                <tr>
                    <td>&nbsp;</td>
                    <td><br></br><CompleteDataSetButton calculations={calculations}></CompleteDataSetButton></td>

                </tr>
            </tbody>
        </table>
    </div>
}

export default BasicDataSetForm