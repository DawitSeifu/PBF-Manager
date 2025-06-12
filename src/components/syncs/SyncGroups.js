import { PluginRegistry } from "@blsq/blsq-report-components";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import groups from "./groups.json";

const codify = str => {
    const code = str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace("/", "_")
      .replace(/-/g, "_")
      .replace(/'/g, "_")
      .replace(/ /g, "_")
      .replace(/__/g, "_")
      .toLowerCase();
  
    return code;
  };


const SyncGroups = (props) => {
  const period = props.period;
  const [organisationUnitGroups, setOrganisationUnitGroups] = useState(
    undefined
  );

  const loadOrganisationUnitGroups = async () => {
    const dhis2 = PluginRegistry.extension("core.dhis2");
    const api = await dhis2.api();
    const ds = await api.get("organisationUnitGroups", {
      filter: ["id:in:[" + groups.map((d) => d.id).join(",") + "]"],
      paging: false,
      fields: "id,name,organisationUnits[id,name]",
    });

    const contractService = PluginRegistry.extension("contracts.service");
    const contracts = await contractService.findAll();

    const activeContracts = contracts.filter((contract) =>
      contract.matchPeriod(period)
    );

    for (let organisationUnitGroup of ds.organisationUnitGroups) {
      const groupInfo = groups.find((g) => g.id === organisationUnitGroup.id);
      const ougOrgunits = new Set(
        organisationUnitGroup.organisationUnits.map((ou) => ou.id)
      );

      const ougContracts = activeContracts.filter((contract) => {
        return groupInfo.contracts.some((filters) => {
          if (filters.length == 1 && filters[0] == "*") {
            return true;
          }
          // TODO AND logic
          return false;
        });
      });
      const missingOrgunits = ougContracts
        .map((c) => c.orgUnit)
        .filter((ou) => !ougOrgunits.has(ou.id));

      const contractOrgUnitIds = new Set(ougContracts.map((c) => c.orgUnit.id));

      organisationUnitGroup.extraOrganisationUnits = organisationUnitGroup.organisationUnits.filter(
        (ou) => !contractOrgUnitIds.has(ou.id)
      );
      organisationUnitGroup.activeContracts = ougContracts;
      organisationUnitGroup.missingOrganisationUnits = missingOrgunits;
    }

    setOrganisationUnitGroups(ds.organisationUnitGroups);
  };

  useEffect(() => {
    loadOrganisationUnitGroups();
  }, []);

  const fixOrganisationUnitGroup = async (organisationUnitGroup) => {
    const dhis2 = PluginRegistry.extension("core.dhis2");
    const api = await dhis2.api();
    const ouGroup = await api.get(
      "organisationUnitGroups/" + organisationUnitGroup.id
    );
    const ougOrgunits = new Set(ouGroup.organisationUnits.map((ou) => ou.id));
    const missing = organisationUnitGroup.missingOrganisationUnits;
    for (let missingOu of missing) {
      if (!ougOrgunits.has(missingOu.id)) {
        ouGroup.organisationUnits.push(missingOu);
      }
    }
    const response = await api.update(
      "organisationUnitGroups/" + ouGroup.id,
      ouGroup
    );
    console.log(response);
  };

  return (
    <div>
      <h1>Groups and contracts</h1>
      <Button
        color="primary"
        variant="contained"
        onClick={async () => {
          for (let ds of organisationUnitGroups) {
            fixOrganisationUnitGroup(ds);
          }
          loadOrganisationUnitGroups();
        }}
      >
        Fix All !
      </Button>
      <Table width="800px">
        <TableBody>
          {organisationUnitGroups &&
            organisationUnitGroups.map((ds) => (
              <TableRow>
                <TableCell>
                  {ds.name}
                  <br></br>
                  <code>{ds.id}</code>
                </TableCell>
                <TableCell>{ds.organisationUnits.length}</TableCell>
                <TableCell>
                  active contracts :
                  <span
                    title={_.shuffle(ds.activeContracts)
                      .map((c) => c.orgUnit.name)
                      .join(", ")}
                  >
                    {ds.activeContracts.length}
                  </span>{" "}
                  <br></br>
                  missing orgunits :{" "}
                  <span
                    title={_.shuffle(ds.missingOrganisationUnits)
                      .map((ou) => ou.name)
                      .join(", ")}
                  >
                    {ds.missingOrganisationUnits.length}
                  </span>{" "}
                  <br></br>
                  extra orgunits :{" "}
                  <span
                    title={_.shuffle(ds.extraOrganisationUnits)
                      .map((ou) => ou.name)
                      .join(", ")}
                  >
                    {ds.extraOrganisationUnits.length}
                  </span>
                </TableCell>

                <TableCell>
                  {ds.workflow && ds.workflow.name}
                  {ds.workflow == undefined && (
                    <Button
                      onClick={() => {
                        fixOrganisationUnitGroup(ds);
                        loadOrganisationUnitGroups();
                      }}
                    >
                      Fix add missing orgunits !
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

export default SyncGroups;
