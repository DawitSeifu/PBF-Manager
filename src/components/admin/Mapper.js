import projectDescriptor from "../../data/2025-project_descriptor";
import {
  DatePeriods
} from "@blsq/blsq-report-components";
import BaseMapper from "../shared/BaseMapper";

class Mapper extends BaseMapper {
  constructor(complex) {
    super();
    this.complex = complex;
  }
  mapValues(request, values) {
    const payment =
      projectDescriptor.payment_rules[request.invoiceType.payment_rule];
    const quantityPackage =
      payment.packages[request.invoiceType.quantity_package];

    const quantity = {
      activities: this.mapQuantityActivities(quantityPackage, request, values)
    };

    var totals = {};
    totals.fraud_retention_amount = values.amount(
      payment.formulas
        .fraud_retention_amount.de_id,
      request.period
    );
    totals.total_before_managed_facilities_fraud = values.amount(
      payment.formulas
        .total_before_managed_facilities_fraud.de_id,
      request.period
    );
    totals.facilities_managed_fraud = values.amount(
      payment.formulas
        .facilities_managed_fraud.de_id,
      request.period
    );
    totals.totalAmount = values.amount(
      payment.formulas
        .total_payment.de_id,
      request.period
    );
    const invoice = {
      orgUnit: request.orgUnit,
      orgUnits: request.orgUnits,
      quantity: quantity,
      totals: totals
    };
    return invoice;
  }

  mapQuantityActivities(orbfPackage, request, values) {
    const activityDescriptors = orbfPackage.activities;
    const fields = [
      "verified",
      "price",
      "amount"
    ];

    return activityDescriptors.map(descriptor => {
      const line = {
        descriptor: descriptor
      };

      fields.forEach(field => {
        line[field] = values.amount(descriptor[field], request.period);
        line[field].expression = orbfPackage.activity_formulas[field] ?
          orbfPackage.activity_formulas[field].expression :
          undefined;
      });
      return line;
    });
  }
}

export default Mapper;
