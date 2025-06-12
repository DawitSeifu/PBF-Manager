import projectDescriptor from "../../data/2025-project_descriptor";
import { DatePeriods } from "@blsq/blsq-report-components";
import BaseMapper from "../shared/BaseMapper";

class Mapper extends BaseMapper {
  constructor(quantity, quantityAmount, totalAmountLost, quantity_hp) {
    super();
    this.quantity = quantity;
    this.quantityAmount = quantityAmount;
    this.totalAmountLost = totalAmountLost;
    this.quantity_hp = quantity_hp;
  }
  mapValues(request, values) {
    const payment =
      projectDescriptor.payment_rules[request.invoiceType.payment_rule];
    const quantityPackage =
      payment.packages[request.invoiceType.quantity_package];

    const quantity = {
      activities: this.mapQuantityActivities(quantityPackage, request, values)
    };
    const quantityPackageHC = payment.packages[this.quantity];

    var totals = {};

    if (request.invoiceType.code === "hc-monthly") {
      ["total_quantity_amount", "total_amount_lost"].map(formula_code => {
        totals[formula_code] = values.amount(
          quantityPackageHC.formulas[formula_code].de_id,
          request.period
        );
      });
      ["hc_hp_amount", "hc_hp_amount_lost"].map(formula_code => {
        totals[formula_code] = values.amount(
          payment.packages.health_center_hp_quantity.formulas[formula_code]
            .de_id,
          request.period
        );
      });
      var hc_total = values.amount(
        payment.packages.quantity_health_center.formulas
          .total_quantity_amount.de_id,
        request.period
      );
      var hp_total = values.amount(
        payment.packages.health_center_hp_quantity.formulas
          .hc_hp_amount.de_id,
        request.period
      );

      totals.totalAmount = {};
      totals.totalAmount.value = hc_total.value += hp_total.value;

    }
    if (request.invoiceType.code === "hosp-monthly") {
      [
        "total_monthly_quantity_amount",
        "total_monthly_quantity_amount_lost"
      ].map(formula_code => {
        totals[formula_code] = values.amount(
          quantityPackageHC.formulas[formula_code].de_id,
          request.period
        );
      });
    }

    if (request.invoiceType.code === "hp-monthly") {
      ["total_amount_lost_hp", "total_quantity_amount_hp"].map(formula_code => {
        totals[formula_code] = values.amount(
          payment.packages.quantity_health_post.formulas[formula_code].de_id,
          request.period
        );
      });
    }
    if (request.invoiceType.code === "borena-hp-monthly") {
      totals.total_amount_lost_hp = values.amount(
        payment.packages.borena_health_post_quantity.formulas.borena_total_amount_lost_hp.de_id,
        request.period
      );
      totals.total_quantity_amount_hp = values.amount(
        payment.packages.borena_health_post_quantity.formulas.borena_total_quantity_amount_hp.de_id,
        request.period
      );
    }

    const invoice = {
      orgUnit: request.orgUnit,
      orgUnits: request.orgUnits,
      year: request.year,
      quarter: request.quarter,
      months: DatePeriods.monthsNamesInQuarter(request.quarter),
      quantity: quantity,
      totals: totals
    };
    return invoice;
  }

  mapQuantityActivities(orbfPackage, request, values) {
    const activityDescriptors = orbfPackage.activities;
    const fields = [
      "declared",
      "validated",
      "amount_lost",
      "amount",
      "error_margin",
      "unit_price",
      "waiver_status"
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
