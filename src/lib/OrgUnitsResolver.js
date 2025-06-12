import ContractBasedOrgUnitsResolver from "./ContractBasedOrgUnitsResolver"
import GroupBasedOrgUnitsResolver from "./GroupBasedOrgUnitsResolver"

const contractBasedResolver = new ContractBasedOrgUnitsResolver()
const groupBasedResolver = new GroupBasedOrgUnitsResolver()

class OrgUnitsResolver {
    async resolveOrgunits(dhis2, orgUnitId, period, invoiceType, mapper) {    
        if (invoiceType.code.startsWith("nk-")) {
            return contractBasedResolver.resolveOrgunits(dhis2, orgUnitId, period, invoiceType, mapper)
        } else {
            return groupBasedResolver.resolveOrgunits(dhis2, orgUnitId, period, invoiceType, mapper)
        }
    }
}

export default OrgUnitsResolver