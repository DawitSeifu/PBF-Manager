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
      fraud_penalty: values.amount(
        payment.packages.fraud_cases.formulas.fraud_scale.de_id,
        request.period
      ),
      payment_without_fraud: values.amount(
        payment.formulas.payment_without_fraud.de_id,
        request.period
      ),
      fraud_retention_amount: values.amount(
        payment.formulas.fraud_retention_amount.de_id,
        request.period
      ),
      total_payment: values.amount(
        payment.formulas.total_payment.de_id,
        request.period
      ),
      total_quantity_payment: values.amount(
        payment.formulas.total_quantity_payment.de_id,
        request.period
      ),
      quality_score: values.amount(
        payment.formulas.quality_score.de_id,
        request.period
      ),
      technical_quality_score: values.amount(
        payment.formulas.tech_score.de_id,
        request.period
      ),
      quality_payment: values.amount(
        payment.formulas.quality_payment.de_id,
        request.period
      ),
      equity_score: values.amount(
        payment.packages.equity_score.formulas.equity_score.de_id,
        request.period
      ),
      regional_equity_score: values.amount(
        payment.packages.equity_score.formulas.regional_equity_score.de_id,
        request.period
      ),
      customer_verification_score: values.amount(
        payment.packages.community_quality_score.formulas.com_score.de_id,
        request.period
      )
    };
    var totalByMonth = {};

    if (request.invoiceType.code === "health-center-invoice") {
      totalByMonth = monthsPeriods.map(month => {
        return values.amount(
          payment.packages.health_center_quantity.formulas
            .total_quantity_amount.de_id,
          month
        );
      });
      totals.equity_payment = values.amount(
        payment.formulas.equity_bonus.de_id,
        request.period
      );
    }

    if (request.invoiceType.code === "hospital-invoice") {
      totalByMonth = monthsPeriods.map(month => {
        return values.amount(
          payment.packages.hospital_quantity.formulas
            .hospital_quantity_amount.de_id,
          month
        );
      });
    }

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
