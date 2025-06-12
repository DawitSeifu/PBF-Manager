import React from "react";
import { DatePeriods } from "@blsq/blsq-report-components";
import QuantityForm from "./dataentry/QuantityForm";
import QualityForm from "./dataentry/QualityForm"
import CVSForm from "./dataentry/CVSForm"
import BankInfoForm from "./dataentry/BankInfoForm"
import PerformanceForm from "./dataentry/PerformanceForm"
import { generateCalculator } from "@blsq/blsq-report-components";
import allDataEntries from "../data/dataentries.json";
import project from "./Project"
import BasicDataSetForm from "./dataentry/BasicDataSetForm"
import VignettesForm from "./dataentry/VignettesForm";

const dataEntryForms = {
  "QuantityForm": QuantityForm,
  "QualityForm": QualityForm,
  "CVSForm": CVSForm,
  "BankInfoForm": BankInfoForm,
  "PerformanceForm": PerformanceForm,
  "BasicDataSetForm": BasicDataSetForm,
  "VignettesForm": VignettesForm,
  "performance-ong-pf" :QualityForm
};

class DataEntries {

  getCalculator(orgUnit, period, dataEntryCode) {
    const config = this.getDataEntry(dataEntryCode)
    if (config == undefined || config.hesabuPackage == undefined) {
      return {
        setIndexedValues: () => { },
        setDefaultCoc: () => { }
      };
    }
    const project_descriptor = project(period)
    const payment = project_descriptor.payment_rules[config.hesabuPayment]
    const hesabuPackage = payment.packages[config.hesabuPackage]

    const filteredout = config.excludedFormulas || []

    const activity_formulas = Object.keys(hesabuPackage.activity_formulas).filter(f => !filteredout.includes(f))
    const package_formulas = Object.keys(hesabuPackage.formulas).filter(f => !filteredout.includes(f))

    const calculator = generateCalculator(
      hesabuPackage,
      orgUnit.id,
      period,
      activity_formulas,
      package_formulas,
      orgUnit
    );

    return calculator;
  }


  async fetchExtraData(api, orgUnit, period, dataEntry) {
    if (dataEntry.hesabuPayment == undefined) {
      return []
    }

    const project_descriptor = project(period)
    const payment = project_descriptor.payment_rules[dataEntry.hesabuPayment]
    if (payment == undefined) {
      throw new Error("no such '"+dataEntry.hesabuPayment+"' payment rule : see "+Object.keys(project_descriptor.payment_rules).join(" , "))
    }
    const hesabuPackage = payment.packages[dataEntry.hesabuPackage]
    if (hesabuPackage == undefined) {
      throw new Error("no such '"+dataEntry.hesabuPackage+"' payment rule : see "+Object.keys(payment.packages).join(" , "))
    }      
    const datasetIds = payment.output_data_sets.map(ds => ds.id)

    if (datasetIds.length == 0) {
      return []
    }

    const dv = await api.get("/dataValueSets", {
      dataSet: datasetIds,
      dataElementGroup: hesabuPackage.deg_ext_id,
      orgUnit: orgUnit.id,
      period: [period],
    });

    let rawValues = dv.dataValues || [];
    return rawValues
  }
  async fetchExtraMetaData(api, orgUnit, period, dataEntry) {
    return []
    if (dataEntry.code.includes("quality")) {
      return []
    }
    const dv = await api.get("/dataElements", {
      filter: "dataElementGroups.id:in:[rFqRAU3xfTw,MO97mIbayfj,hxK0vys3CkH]",
      fields: "id,name,valueType,optionSet[options[code,name]],categoryCombo[id,name,categoryOptionCombos[id,name]]"
    });
    const dv2 = await api.get("/dataElements", {
      filter: "dataSetElements.dataSet.id:in:[w230GHZKchZ]",
      fields: "id,name,valueType,optionSet[options[code,name]],categoryCombo[id,name,categoryOptionCombos[id,name]]"
    });

    let rawValues = dv.dataElements.concat(dv2.dataElements);
    return rawValues
  }

  getAllDataEntries() {
    return allDataEntries
  }

  getDataEntry(code) {
    return allDataEntries.find((de) => de.code === code);
  }

  getExpectedDataEntryTypes(activeContract, period) {
    return allDataEntries.filter((entry) =>
      entry.contracts.some(contractFilter => contractFilter.every((code) => activeContract.codes.includes(code)))
    );
  }

  getExpectedDataEntries(activeContract, period) {
    const quarter = DatePeriods.split(period, "quarterlyNov")[0];
    return this.getExpectedDataEntryTypes(activeContract, quarter).flatMap(
      (dataEntryType) => {
        return DatePeriods.split(quarter, dataEntryType.frequency).map(
          (entryPeriod) => {
            return { dataEntryType: dataEntryType, period: entryPeriod };
          }
        );
      }
    );
  }

  getDataEntryForm(dataEntryCode) {
    const dataEntryType = this.getDataEntry(dataEntryCode)
    const missing = prop => (<h1 style={{color: "red"}}>not found for {dataEntryCode} : unknown component #{dataEntryType.component}</h1>)
    return dataEntryForms[dataEntryType.component] || missing
  }

  sortActivities(dataEntryType, activities, period) {
    const monthsYear = DatePeriods.split(period, "monthly");
    let dataEntry = dataEntryType.period.find(entry => entry.startPeriod <= monthsYear[0] && monthsYear[2] <= entry.endPeriod);

    const indexes = dataEntry.lines;
    if (indexes !== undefined) {
      activities = activities.sort((a, b) => {
        const indexA = indexes.indexOf(a.code);
        const indexB = indexes.indexOf(b.code);
        return indexA - indexB;
      });
    }
    return activities;
  }
}

export default new DataEntries();
