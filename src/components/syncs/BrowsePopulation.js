import { PluginRegistry } from "@blsq/blsq-report-components";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import _ from "lodash";

import MUIDataTable from "mui-datatables";

const BrowsePopulation = (props) => {
  const { period, orgUnit } = props.match.params;
  const year = period.slice(0, 4);
  const populationDataElementId = "b9qtQHvhUIK";
  const parentId = orgUnit || "pL5A7C1at1M";

  const aireQuery = useQuery(["fetchPopulations", parentId, year], async () => {
    const dhis2 = PluginRegistry.extension("core.dhis2");
    const api = await dhis2.api();

    const mainOrgUnit = await api.get("organisationUnits/" + parentId, {
      fields: "id,name,ancestors[id,name]",
    });
    const airesResp = await api.get("organisationUnits", {
      filter: ["level:eq:4", "path:like:" + parentId],
      fields: "id,name,path,ancestors[id,name]",
      paging: false,
    });

    const values = await api.get("dataValueSets", {
      dataElementGroup: "VH2c8TneJ0x",
      orgUnit: parentId,
      period: year,
      children: true,
    });

    const indexedValues = _.keyBy(
      values.dataValues ? values.dataValues : [],
      (v) => v.orgUnit + "." + v.period + "." + v.dataElement
    );
    const aires = _.sortBy(airesResp.organisationUnits, (ou) =>
      ou.ancestors
        .map((a) => a.name)
        .concat([ou.name])
        .join(" > ")
    );

    for (let aire of aires) {
      aire.ancestors.forEach(
        (a, index) => (aire["ancestor_" + (index + 1)] = a)
      );
      aire.population =
        indexedValues[aire.id + "." + year + "." + populationDataElementId];
      aire.hasPopulation = !!aire.population?.value ? 1 : 0;
    }

    return { aires, values, mainOrgUnit };
  });

  const options = {
    enableNestedDataAccess: ".",
    filter: true,
    print: false,
    rowsPerPage: 5,
    rowsPerPageOptions: [1, 5, 10, 20, 50, 100, 1000],
    selectableRows: "none",
    elevation: 2,
  };

  const toStats = (data, level) => {
    const withPopulationAires = aireQuery.data.aires.filter(
      (aire) => aire.hasPopulation == 0
    );
    const counts = _.countBy(withPopulationAires, (o) => o[level].id);

    const levels = _.uniqBy(
      withPopulationAires.map((o) => o[level]),
      (o) => o.id
    );

    levels.forEach((level) => (level.count = counts[level.id]));
    return levels;
  };
  return (
    <div>
      <div style={{ float: "right" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href={`./index.html#/browse/populations/pL5A7C1at1M/${year}`}>Pays</a>
          {aireQuery.data &&
            aireQuery.data.mainOrgUnit.ancestors &&
            aireQuery.data.mainOrgUnit.ancestors
              .slice(1)
              .map((a) => (
                <a href={`./index.html#/browse/populations/${a.id}/${year}`}>{a.name}</a>
              ))}
        </div>
      </div>

      <h1>
        Population par Aire de santé pour l'année {year} dans{" "}
        {aireQuery.data && aireQuery.data.mainOrgUnit.name}
      </h1>
      {aireQuery.data && (
        <MUIDataTable
          data={aireQuery.data.aires}
          options={options}
          columns={[
            { name: "id", label: "id" },
            { name: "ancestor_2.name", label: "DPS" },
            { name: "ancestor_2.id", label: "DPS Id" },
            { name: "ancestor_3.name", label: "Zone" },
            { name: "ancestor_3.id", label: "Zone Id" },
            { name: "name", label: "Aire" },
            { name: "hasPopulation", label: "Population ?" },
            { name: "population.value", label: "Population" },
          ]}
        />
      )}
      {aireQuery.data && (
        <div>
          <br></br>
          <li>
            avec une population{" "}
            {aireQuery.data.aires.filter((aire) => aire.hasPopulation).length},
            population total :{" "}
            {aireQuery.data.aires
              .filter((aire) => aire.hasPopulation)
              .map((aire) => parseFloat(aire.population.value))
              .reduce((a, b) => a + b, 0)}
          </li>
          <li>
            sans population{" "}
            {
              aireQuery.data.aires.filter((aire) => aire.hasPopulation == 0)
                .length
            }
          </li>

          <br></br>
          <h2>Sans population</h2>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div>
              <h3>Par dps</h3>
              <MUIDataTable
                data={toStats(aireQuery.data, "ancestor_2")}
                options={options}
                columns={[
                  { name: "id", label: "id" },
                  { name: "name", label: "Dps" },
                  { name: "count", label: "Aires sans population" },
                ]}
              />
            </div>
            <div>
              <h3>Par zone</h3>

              <MUIDataTable
                data={toStats(aireQuery.data, "ancestor_3")}
                options={options}
                columns={[
                  { name: "id", label: "id" },
                  { name: "name", label: "Zone" },
                  { name: "count", label: "Aires sans population" },
                ]}
              />
            </div>
          </div>
          <br></br>
        </div>
      )}
    </div>
  );
};

export default BrowsePopulation;
