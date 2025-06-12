
const fullName = (orgUnit) => orgUnit.ancestors.map(a => a.name).join(" > ")

class Mapper {
  mapValues(request, values) {

    request.orgUnits.sort((a,b) => { return fullName(a).localeCompare(fullName(b))})
    const invoice = {
      orgUnit: request.mainOrgUnit,
      orgUnits: request.orgUnits,
      year: request.year,
      quarter: request.quarter,
      activities: [],
      totals: {}
    };
    return invoice;
  }
}

export default Mapper;
