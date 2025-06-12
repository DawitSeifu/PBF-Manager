import React, { useEffect, useState } from "react";
import _ from "lodash";

import { Grid, Card, CardContent, Typography, TextField } from "@material-ui/core";
import Switch from '@material-ui/core/Switch';
import { DatePeriods } from "@blsq/blsq-report-components"
import Invoices from "./Invoices";

const TestData = ({ dhis2 }) => {
  const baseUrl = dhis2.baseUrl
  const invoiceDescriptors = Invoices.getAllInvoiceTypes()
  const [query, setQuery] = useState(undefined);
  const [showDetails, setShowDetails] = useState(false);
  const [dataElementGroupsById, setDataElementGroupsById] = useState(undefined);
  const [dataSetsById, setDataSetsById] = useState(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const api = await dhis2.getApi();

      const degs = await api.get("dataElementGroups", {
        paging: false,
        fields: "id,name",
      });

      const datasets = await api.get("dataSets", {
        paging: false,
        fields: "id,name",
      });

      setDataElementGroupsById(_.keyBy(degs.dataElementGroups, (de) => de.id));
      setDataSetsById(_.keyBy(datasets.dataSets, (de) => de.id));
    };
    fetchData();
  }, [setDataElementGroupsById, setDataSetsById]);

  const handleChange = (event) => {
    setShowDetails(event.target.checked)
  }

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }


  return (
    <div>
      <h1>
        Check you didn't break the <code>{invoiceDescriptors.length}</code>{" "}
        invoices/reports !
      </h1>
      <TextField value={query} onChange={handleQueryChange}></TextField>
      <Switch inputProps={{ "aria-label": "primary checkbox" }} onChange={handleChange} checked={showDetails}/>
      <Typography>Don't forget to add testData on new invoices</Typography>
      <Grid container spacing={2}>
        {invoiceDescriptors
          .filter(d => query ? d.name.includes(query) || d.code.includes(query) : true )
          .sort((a, b) => a.code.localeCompare(b.code))
          .map((invoiceDescriptor) => (
            <Grid item xs={3} sm={3} style={{ margin: "10px" }}>
              <Card>
                <CardContent
                  style={{
                    backgroundColor: (invoiceDescriptor.testData && invoiceDescriptor.testData.length >0) ? "" : "red",
                  }}
                >
                  <div>
                    <span>{invoiceDescriptor.name}</span>
                    <br />
                    <code>{invoiceDescriptor.code}</code>
                    <code>
                      {" "}
                      <a
                        href={`${baseUrl}/api/organisationUnitGroups/${invoiceDescriptor.organisationUnitGroup}.json?fields=id,name,organisationUnits[id,name]`}
                      >
                        {invoiceDescriptor.organisationUnitGroup}
                      </a>
                    </code>
                    <br />
                    {showDetails && (
                      <div>
                         <br />
                        DEG :{" "}
                        <ul>
                          {dataElementGroupsById &&
                            invoiceDescriptor.dataElementGroups.map((degId) => {
                              const deg = dataElementGroupsById[degId];
                              return deg ? (
                              <li>{deg.name}&nbsp;<code>{degId}</code></li>
                              ) : (
                                <li style={{ color: "red" }}>{degId}&nbsp;</li>
                              );
                            })}
                        </ul>
                        DS :{" "}
                        <ul>
                          {dataSetsById &&
                            invoiceDescriptor.dataSets.map((degId) => {
                              const deg = dataSetsById[degId];
                              return deg ? (
                                <li>{deg.name}&nbsp;<code>{degId}</code></li>
                              ) : (
                                <li style={{ color: "red" }}>{degId}&nbsp;</li>
                              );
                            })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <br></br>

                  {invoiceDescriptor.testData &&
                    invoiceDescriptor.testData.map((testData) => {
                      return (
                        <td>
                          {testData.name && (
                            <span>
                              <b>{testData.name}</b>
                              <br></br>
                            </span>
                          )}
                          <a
                            href={`/index.html#/reports/${testData.period}/${testData.orgUnit}/${invoiceDescriptor.code}`}
                          >
                            local
                          </a>
                          <br></br>
                          <a
                            href={`${baseUrl}/api/apps/ORBF2---Invoices-and-Reports/index.html#/reports/${testData.period}/${testData.orgUnit}/${invoiceDescriptor.code}`}
                          >
                            remote
                          </a>
                          <br></br>
                          <a
                            href={`${baseUrl}/api/apps/Hesabu/index.html#/simulation?periods=${DatePeriods.split(testData.period,"quarterly")[0]}&orgUnit=${testData.orgUnit}`}
                          >
                            simulation
                          </a>
                        </td>
                      );
                    })}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default TestData;
