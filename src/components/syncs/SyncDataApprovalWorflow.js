import { PluginRegistry } from "@blsq/blsq-report-components";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Invoices from "../Invoices";
import project from "../Project";

const SyncDataApprovalWorflow = (props) => {
  const [dataSets, setDataSets] = useState(undefined);

  const loadDataSets = async () => {
    const outputDataSets = [];
    const descriptors = [project("201901"), project("202101")];
    for (let projectDescriptor of descriptors) {
      for (let paymentCode of Object.keys(projectDescriptor.payment_rules)) {
        const datasets =
          projectDescriptor.payment_rules[paymentCode].output_data_sets;
        for (let ds of datasets) {
          outputDataSets.push(ds);
        }
      }
    }

    const dhis2 = PluginRegistry.extension("core.dhis2");
    const api = await dhis2.api();
    const ds = await api.get("dataSets", {
      filter: ["id:in:[" + outputDataSets.map((d) => d.id).join(",") + "]"],
      paging: false,
      fields: "id,name,periodType,workflow[id,name,periodType,:all]",
    });
    setDataSets(ds.dataSets);
  };

  useEffect(() => {
    loadDataSets();
  }, []);

  const fixDataSet = async (dataset) => {
    if (dataset.workflow !== undefined) {
      return;
    }
    const workflows = Invoices.getDataApprovalWorkflows();
    const workflow = workflows.find(
      (workflow) => workflow.periodType == dataset.periodType
    );
    const dhis2 = PluginRegistry.extension("core.dhis2");
    const api = await dhis2.api();
    const dataSet = await api.get("dataSets/" + dataset.id);
    dataSet.workflow = workflow;
    const response = await api.update("dataSets/" + dataset.id, dataSet);
    console.log(response);
  };

  return (
    <div>
      <h1>Data approval workflow for output datasets</h1>
      <Button
        color="primary"
        variant="contained"
        onClick={async () => {
          for (let ds of dataSets) {
            fixDataSet(ds);
          }
          loadDataSets();
        }}
      >
        Fix All !
      </Button>
      <Table width="800px">
        <TableBody>
          {dataSets &&
            dataSets.map((ds) => (
              <TableRow>
                <TableCell>
                  {ds.name}
                  <br></br>
                  <code>
                    {ds.id} - {ds.periodType}
                  </code>
                </TableCell>

                <TableCell>
                  {ds.workflow && ds.workflow.name}
                  {ds.workflow == undefined && (
                    <Button
                      onClick={() => {
                        fixDataSet(ds);
                        loadDataSets();
                      }}
                    >
                      Fix !
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SyncDataApprovalWorflow;
