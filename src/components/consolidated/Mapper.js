import projectDescriptor from "../../data/2025-project_descriptor.json";
import { DatePeriods } from "@blsq/blsq-report-components";
import Invoices from "../Invoices";

const HOSPITAL_GROUP_ID = "";
const PRIMARY_GROUP_ID = "";

class Mapper {
	mapValues(request, values) {
		var quarterlyCode = "";
		let mapper = null;

		let allOrgUnits = [];
		if (request.invoiceType.code === "consolidated-invoice") {
			allOrgUnits = request.orgUnits.filter(ou =>
				ou.organisationUnitGroups.some(g => [HOSPITAL_GROUP_ID].includes(g.id))
			)
		} else {
			allOrgUnits = request.orgUnits.filter(orgUnit => !orgUnit.organisationUnitGroups.some(g => [PRIMARY_GROUP_ID].includes(g.id)));
		}

		const organisationUnits = allOrgUnits.filter(ou => ou.organisationUnitGroups.some(g => [HOSPITAL_GROUP_ID].includes(g.id) || ![HOSPITAL_GROUP_ID].includes(g.id))).map(ou => {

			const paymentRule = projectDescriptor.payment_rules[mapper.descriptor.paymentRule.type];

			return {
				id: ou.id,
				name: ou.name,
				invoiceCode: quarterlyCode,
				year: request.year,
				quarter: request.quarter,
				period: request.period,
				mapper: mapper,
				paymentRule: values.amountByOrgUnit(paymentRule.formulas.payment.de_id, ou.id, request.period)
			};
		});

		var totals = 0;
		organisationUnits.forEach(function (orgUnit) {
			totals += Number(orgUnit.paymentRule.value);
		});

		const invoice = {
			request: request,
			orgUnit: request.mainOrgUnit,
			months: DatePeriods.monthsNamesInQuarter(request.quarter),
			orgUnits: organisationUnits,
			invoiceType: request.invoiceType,
			payment: {
				code: "",
				name: "Total to pay",
				period: request.period,
				value: parseFloat(totals.toFixed(2))
			}
		};
		return invoice;
	}
}
export default Mapper;
