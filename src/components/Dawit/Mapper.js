import projectDescriptor from "../../data/2025-projectDescriptor";
import { DatePeriods } from "@blsq/blsq-report-components";
import BaseMapper from "../shared/BaseMapper";



function getMonthNamesByQuarter(quarterIntOrString) {
  const MONTH_NAMES = ["Meskerem", "Tikemet", "Hidar", "Tahesas", "Tir", "Yekatit", "Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehase"];
  const MONTH_NAMES_BY_QUARTER = {
    4: [MONTH_NAMES[10], MONTH_NAMES[11], MONTH_NAMES[0]],
    1: [MONTH_NAMES[1], MONTH_NAMES[2], MONTH_NAMES[3]],
    2: [MONTH_NAMES[4], MONTH_NAMES[5], MONTH_NAMES[6]],
    3: [MONTH_NAMES[7], MONTH_NAMES[8], MONTH_NAMES[9]]
  }
  var quarter = "" + quarterIntOrString;
  var months = [];
  months = MONTH_NAMES_BY_QUARTER[quarter];

  if (months === undefined) {
    throw new Error("Doesn't appear to be a quarter " + quarter);
  }

  return months;
}
class Mapper extends BaseMapper {
  constructor() {
    super();
  }

  mapValues(request, values) {
    const invoiceType = request.invoiceType;
    const payment = projectDescriptor.payment_rules[invoiceType.paymentRule];
    const quarterPeriod = DatePeriods.split(request.period, "quarterlyNov")[0];

    const monthsPeriods = DatePeriods.split(quarterPeriod, "monthly");
    var totals = {};
    totals = {
     
      total_payment: values.amount(
        payment.formulas.total_payment.de_id,
        request.period
      )    
    };
    var totalByMonth = {};

     const invoice = {
      orgUnit: request.orgUnit,
      orgUnits: request.orgUnits,
      year: request.year,
      quarter: request.quarter,
      months: getMonthNamesByQuarter(request.quarter),
      totalByMonth: totalByMonth,
      totals: totals
    };

    return invoice;
  }
}

export default Mapper;
