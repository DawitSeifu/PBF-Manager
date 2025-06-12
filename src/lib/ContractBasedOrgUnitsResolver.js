import { PluginRegistry } from "@blsq/blsq-report-components";

const matchInvoiceType = (invoiceType, contract) => {
    return invoiceType.contracts.some(contractFilter => contractFilter.every((code) => contract.codes.includes(code)))
}

class ContractBasedOrgUnitsResolver {
    async resolveOrgunits(dhis2, orgUnitId, period, invoiceType, mapper) {
        let mainOrgUnit,
            orgUnits = [],
            categoryCombo = "";

        const contractService = PluginRegistry.extension("contracts.service");
        const contracts = await contractService.findAll();

        let mainOrgUnitContract = contracts.find(
            contract =>
                contract.matchPeriod(period) && contract.orgUnit.id === orgUnitId
        );

        orgUnits = contracts
            .filter(
                contract =>
                    contract.orgUnit.path.includes(orgUnitId) &&
                    matchInvoiceType(invoiceType, contract) &&
                    contract.matchPeriod(period)
            )
            .map(contract => {
                contract.orgUnit.ancestors = contract.orgUnit.ancestors.filter(
                    ancestor => ancestor.id !== contract.orgUnit.id
                );
                return contract.orgUnit;
            });


        mainOrgUnit = mainOrgUnitContract.orgUnit
        mainOrgUnit.activeContracts = [mainOrgUnitContract]

        if (orgUnits.length == 0) {
            orgUnits.push(mainOrgUnit)
        }

        return {
            mainOrgUnit,
            orgUnits,
            categoryCombo
        };
    }
}

export default ContractBasedOrgUnitsResolver