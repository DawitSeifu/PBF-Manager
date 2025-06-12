class BaseMapper {
  totalsToPay(payment, request, values) {
    const totals = {};
    Object.keys(payment.formulas).forEach(formula_code => {
      totals[formula_code] = values.amount(
        payment.formulas[formula_code].de_id,
        request.period
      );
    });

    Object.keys(payment.packages).forEach(package_code => {
      Object.keys(payment.packages[package_code].formulas).forEach(
        formula_code => {
          totals[formula_code] = values.amount(
            payment.packages[package_code].formulas[formula_code].de_id,
            request.period
          );
        }
      );
    });
    return totals;
  }

  mapQuality(orbf_package, request, values) {
    const activityDescriptors = orbf_package.activities;
    activityDescriptors.sort(function(a, b) {
      return a.code.localeCompare(b.code);
    });
    const activities = activityDescriptors.map(descriptor => {
      return {
        descriptor: descriptor,
        reached: values.amount(descriptor.reached, request.period),
        max_points: values.amount(descriptor.max_points, request.period),
        unit_price: values.amount(descriptor.unit_price, request.period),
        subsidies_obtained: values.amount(
          descriptor.subsidies_obtained,
          request.period
        )
      };
    });
    const total_subsidies_key = Object.keys(orbf_package.formulas).find(key =>
      key.endsWith("total_subsidies")
    );
    const totals = {
      subsidies_obtained: total_subsidies_key
        ? values.amount(
            orbf_package.formulas[total_subsidies_key].de_id,
            request.period
          )
        : {}
    };
    return {
      package: orbf_package,
      activities: activities,
      totals: totals
    };
  }

  avg(lines, field) {
    const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
    const datas = lines
      .map(line => line.totals[field])
      .map(val => val.value)
      .filter(val => val !== " ");
    const ref = lines[0].totals[field];
    if (datas.length > 0) {
      return {
        ...ref,
        value: average(datas)
      };
    } else {
      return { ...ref, value: "" };
    }
  }

  sum(lines, field) {
    const sum = arr => arr.reduce((p, c) => p + c, 0);
    const datas = lines
      .map(line => line[field])
      .map(val => val.value)
      .filter(val => val !== " ")
      .map(val => parseInt(parseFloat(val).toFixed(0)));

    const ref = lines[0][field];
    if (datas.length > 0) {
      return { ...ref, value: sum(datas) };
    } else {
      return { ...ref, value: "" };
    }
  }
}

export default BaseMapper;
