import { DatePeriods, PluginRegistry } from "@blsq/blsq-report-components";
import _ from "lodash";

const isBefore = (period, monthLimit) => {
  const monthPeriod = DatePeriods.split(period, "monthly")[0];
  return monthPeriod < monthLimit;
};

class GroupBasedOrgUnitsResolver {
  async resolveOrgunits(dhis2, orgUnitId, period, invoiceType, mapper) {
    let mainOrgUnit,
      orgUnits = [],
      categoryCombo = "";

    const isBefore2020Q4 = isBefore(period, "202010");

    if (invoiceType.isPartner) {
      categoryCombo = orgUnitId;
      const country = await dhis2.getTopLevels([1]);
      orgUnitId = country.organisationUnits[0].id;
    }
    if (invoiceType.contractGroupSet && isBefore2020Q4) {
      orgUnits = await dhis2.getOrgunitsForContract(
        orgUnitId,
        invoiceType.contractGroupSet
      );
      mainOrgUnit = await dhis2.getOrgunit(orgUnitId);
    } else if (invoiceType.organisationUnitGroup) {
      mainOrgUnit = await dhis2.getOrgunit(orgUnitId);
      // http://localhost:3000/index.html#/reports/2021Q1/pIAYIpy4hiH/quarterly-deposit-dps-payment-order
      // http://localhost:3000/index.html#/reports/2021Q2/pIAYIpy4hiH/quarterly-advance-dps-consolidated
      // QUID :
      //     quarterly-deposit-zs-consolidated
      //     quarterly-advance-zs-consolidated
      if (true) {
        const contractService = PluginRegistry.extension("contracts.service");
        const contracts = await contractService.findAll();
        const contractByOrgunitId = _.groupBy(
          contracts,
          (contract) => contract.orgUnit.id
        );

        orgUnits = [];

        for (let ouid of Object.keys(contractByOrgunitId)) {
          const contractsForOrgUnit = contractByOrgunitId[ouid];
          const activeContracts = contractsForOrgUnit.filter((contract) =>
            contract.matchPeriod(period)
          );
          if (activeContracts.length > 0) {
            const orgUnit = activeContracts[0].orgUnit;
            if (orgUnit.path.includes(orgUnitId)) {
              orgUnit.activeContracts = activeContracts;
              orgUnits.push(orgUnit);
            }
          }
        }
      } else {
        orgUnits = await dhis2.getOrgunitsForGroup(
          orgUnitId,
          invoiceType.organisationUnitGroup
        );
        orgUnits = orgUnits.organisationUnits;
      }
    } else {
      mainOrgUnit = await dhis2.getOrgunit(orgUnitId);
      orgUnits = [mainOrgUnit];

      if (!isBefore2020Q4) {
        const contractService = PluginRegistry.extension("contracts.service");
        const contracts = await contractService.findAll();
        const contractByOrgunitId = _.groupBy(
          contracts,
          (contract) => contract.orgUnit.id
        );
        const contractsForOrgUnit = contractByOrgunitId[orgUnitId];
        const activeContracts = contractsForOrgUnit.filter(
          (contract) =>
            contract.matchPeriod(period) && contract.orgUnit.id == orgUnitId
        );
        mainOrgUnit.activeContracts = activeContracts;
        if (activeContracts[0]) {
          mainOrgUnit.codes = activeContracts[0].codes
        }   
      }
    }

    return {
      mainOrgUnit,
      orgUnits,
      categoryCombo,
    };
  }
}
export default GroupBasedOrgUnitsResolver;
