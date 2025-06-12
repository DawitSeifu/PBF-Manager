import projectDescriptor from "../../data/2025-projectDescriptor";
import { DatePeriods } from "@blsq/blsq-report-components";
import BaseMapper from "../shared/BaseMapper";

class Mapper extends BaseMapper {
  mapValues(request, values) {
    const payment =
      projectDescriptor.payment_rules[request.invoiceType.payment_rule];
    const quantityPackage =
      payment.packages[request.invoiceType.quantity_package];

    const mappings = request.invoiceType.mappings;
    const quantity = {
      activities: this.mapQuantityActivities(quantityPackage, request, values)
    };

    const quarterPeriod = DatePeriods.split(request.period, "quarterly")[0];
    const currentMonthPeriod = request.period;
    const monthsPeriods = DatePeriods.split(quarterPeriod, "monthly");

    const totals = {};
    Object.keys(payment.packages).forEach(packageCode => {
      const orbfPackage = payment.packages[packageCode];

      Object.keys(orbfPackage.formulas).forEach(formulaCode => {
        const periods =
          orbfPackage.formulas[formulaCode].frequency == "monthly"
            ? monthsPeriods
            : [quarterPeriod];

        totals[formulaCode] = periods.map(period =>
          values.amount(orbfPackage.formulas[formulaCode].de_id, period)
        );
        totals[formulaCode].forEach(val => {
          val.expression = orbfPackage.formulas[formulaCode].expression;
        });
        if (periods.length === 1) {
          totals[formulaCode] = totals[formulaCode][0];
        }
      });
    });

    const periods = monthsPeriods;
    Object.keys(payment.formulas).forEach(formulaCode => {
      totals[formulaCode] = periods.map(period =>
        values.amount(payment.formulas[formulaCode].de_id, period)
      );

      totals[formulaCode].forEach(val => {
        val.expression = payment.formulas[formulaCode].expression;
      });

      if (periods.length === 1) {
        totals[formulaCode] = totals[formulaCode][0];
      }
    });

    const invoice = {
      orgUnit: request.orgUnit,
      orgUnits: request.orgUnits,
      year: request.year,
      quarter: request.quarter,
      months: DatePeriods.monthsNamesInQuarter(request.quarter),
      quantity: quantity
    };

    return invoice;
  }

  totalsFor(orbf_package, request, values) {
    return {
      quantity_subsidies_obtained: values.amount(
        orbf_package.formulas.quantity_subsidies_obtained.de_id,
        request.period
      )
    };
  }

  mapQuantityActivities(orbfPackage, request, values) {
    const activityDescriptors = orbfPackage.activities;
    // activityDescriptors.sort(function(a, b) {
    //   return a.normalizedCode.localeCompare(b.normalizedCode, undefined, {
    //     numeric: true
    //   });
    // });
    const fields = [
      "declared",
      "validated",
      "price",
      "amount",
      "error_margin"
    ];

    return activityDescriptors.map(descriptor => {
      const line = {
        descriptor: descriptor
      };

      fields.forEach(field => {
        line[field] = values.amount(descriptor[field], request.period);
        line[field].expression = orbfPackage.activity_formulas[field]
          ? orbfPackage.activity_formulas[field].expression
          : undefined;
      });
      return line;
    });
  }
}

export default Mapper;
