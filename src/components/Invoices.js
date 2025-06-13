import ConsolidatedMapper from "./consolidated/Mapper";
import ConsolidatedInvoice from "./consolidated/Invoice";

import DawitMapper from "./Dawit/Mapper";
import DawitInvoice from "./Dawit/Invoice";

import AdminMapper from "./admin/Mapper";
import AdminInvoice from "./admin/Invoice";

import EhisMapper from "./ehis/Mapper";
import EhisInvoice from "./ehis/Invoice";

import CboMapper from "./cbo/Mapper";
import CboInvoice from "./cbo/Invoice";

import QuarterlyMapper from "./quarterly/Mapper";
import QuarterlyInvoice from "./quarterly/Invoice";

import ApprovalsMapper from "./approvals/Mapper";
import ApprovalsInvoice from "./approvals/Invoice";

import { DatePeriods } from "@blsq/blsq-report-components";
import invoiceDescriptors from "../data/invoice-descriptors.json";
import project_descriptor from "../data/2025-projectDescriptor";
import { indexBy } from "@blsq/blsq-report-components";

// Invoice codes
const DAWIT_CODE = "Dawit-invoice";
const HEALTH_CENTER_CODE = "health-center-invoice";
const HOSPITAL_CODE = "hospital-invoice";
const WHO_CODE = "woreda-invoice";
const ZHD_CODE = "zone-invoice";
const PURCHASER_CODE = "purchaser-invoice";
const CBO_CODE = "cbo-invoice";

const APPROVALS_CODE = "approvals";

const DESCRIPTOR_BY_CODE = indexBy(invoiceDescriptors, (e) => e.code);

const enrich = (invoice, payment_rule) => {
  payment_rule.output_data_sets.forEach((ds) => invoice.dataSets.push(ds.id));
  Object.keys(payment_rule.packages).forEach((packageCode) => {
    const hesabuPackage = payment_rule.packages[packageCode];
    invoice.dataElementGroups.push(hesabuPackage.deg_ext_id);
  });
};

enrich(
  DESCRIPTOR_BY_CODE[DAWIT_CODE],
  project_descriptor.payment_rules.health_center_payment
);
enrich(
  DESCRIPTOR_BY_CODE[HEALTH_CENTER_CODE],
  project_descriptor.payment_rules.health_center_payment
);
enrich(
  DESCRIPTOR_BY_CODE[HOSPITAL_CODE],
  project_descriptor.payment_rules.hospital_payment
);
enrich(
  DESCRIPTOR_BY_CODE[WHO_CODE],
  project_descriptor.payment_rules.who_payment
);
enrich(
  DESCRIPTOR_BY_CODE[ZHD_CODE],
  project_descriptor.payment_rules.zhd_payment
);
enrich(
  DESCRIPTOR_BY_CODE[PURCHASER_CODE],
  project_descriptor.payment_rules.purchaser_payment
);
enrich(
  DESCRIPTOR_BY_CODE[CBO_CODE],
  project_descriptor.payment_rules.cbo_payment
);

const dataApprovalWorkflows = [
  {
    name: "FBP Approval Monthtly",
    id: "hZNaH5nb8aW",//TODO
    periodType: "Monthly",
    dataApprovalLevels: [
      {
        name: "Zone",
        orgUnitLevel: 3,
      },
    ],
  },
  {
    name: "FBP Approval Quarterly",
    id: "RJg7qsFGzhL",//TODO
    periodType: "quarterlyNov",
    dataApprovalLevels: [
      {
        name: "Zone",
        orgUnitLevel: 3,
      },
    ],
  },
];

const INVOICES = {
  [DAWIT_CODE]: {
    component: DawitInvoice,
    mapper: new DawitMapper(),
  },

  [APPROVALS_CODE]: {
    component: ApprovalsInvoice,
    mapper: new ApprovalsMapper(),
  },
  [WHO_CODE]: {
    component: AdminInvoice,
    mapper: new AdminMapper(0),
  },
  [ZHD_CODE]: {
    component: AdminInvoice,
    mapper: new AdminMapper(0),
  },
  [PURCHASER_CODE]: {
    component: EhisInvoice,
    mapper: new EhisMapper(),
  },
  [HEALTH_CENTER_CODE]: {
    component: QuarterlyInvoice,
    mapper: new QuarterlyMapper(),
  },
  [HOSPITAL_CODE]: {
    component: QuarterlyInvoice,
    mapper: new QuarterlyMapper(),
  },
  [CBO_CODE]: {
    component: CboInvoice,
    mapper: new CboMapper(),
  },
};

class Invoices {
  getDataApprovalWorkflows() {
    return dataApprovalWorkflows;
  }

  hasGroup(ou, contractCode) {
    const contracts = ou.contracts
    if (contracts) {
      if (contracts.length == 0) {
        return false;
      }
      return contracts[0].codes.includes(contractCode);
    }
    return false
  }

  getInvoiceTypeCodes(ou) {
    const invoiceCodes = [];

    if (this.hasGroup(ou, "pbf_health_center")) {
      invoiceCodes.push(DAWIT_CODE);
    }

    if (this.hasGroup(ou, "pbf_health_center")) {
      invoiceCodes.push(HEALTH_CENTER_CODE);
      invoiceCodes.push(CBO_CODE);
    }

    if (this.hasGroup(ou, "pbf_hospital")) {
      invoiceCodes.push(HOSPITAL_CODE);
      invoiceCodes.push(CBO_CODE);
    }

    if (this.hasGroup(ou, "pbf_woreda")) {
      invoiceCodes.push(WHO_CODE);
    }

    if (this.hasGroup(ou, "pbf_zone")) {
      invoiceCodes.push(ZHD_CODE);
      invoiceCodes.push(PURCHASER_CODE);
    }

    if (ou.level === 2) {
      invoiceCodes.push(APPROVALS_CODE);
    }
    return invoiceCodes;
  }

  getAllInvoiceTypes() {
    return Object.values(DESCRIPTOR_BY_CODE);
  }

  getInvoiceType(code) {
    let invoice = DESCRIPTOR_BY_CODE[code];
    if (invoice) {
      return invoice;
    }
    throw new Error("not supported type : " + code);
  }

  getInvoiceTypes(codes) {
    return codes.map((code) => this.getInvoiceType(code));
  }
  component(code) {
    return INVOICES[code].component;
  }

  mapper(code) {
    if (INVOICES[code] == undefined) {
      debugger;
    }
    return INVOICES[code].mapper;
  }

  isCalculable(invoice, currentUser) {
    debugger;
    return this.getOrbfCalculations(invoice, currentUser).length !== 0;
  }

  getOrbfCalculations(invoice, currentUser) {
    if (currentUser === undefined) {
      return [];
    }

    let hZones = invoice.orgUnits;

    // const userOrgunits = currentUser.organisationUnits.map(ou => ou.id);
    const periods = DatePeriods.split(invoice.period, "quarterly");

    const rawCalculations = hZones
      .map((zone) => {
        if (zone.zoneOus === undefined) {
          if (
            zone.activeContracts &&
            zone.activeContracts.length > 0 &&
            ["cas_pca", "cas_pma", "eczs_cas"].some((c) =>
              zone.codes.includes(c)
            )
          ) {
            return zone;
          }
          if (
            zone.organisationUnitGroups !== undefined &&
            zone.organisationUnitGroups.some((g) =>
              ["TODO"].includes(g.id)
            )
          ) {
            return zone; // ceci est une FOSA cas, on la retourne
          } else {
            return zone.ancestors !== undefined &&
              zone.ancestors[1] !== undefined
              ? [{ id: zone.ancestors[1].id }]
              : []; // ceci est un temoin. On retourne la DPS ?
          }
        } else {
          return zone.zoneOus.filter((ou) => {
            if (
              ou.activeContracts &&
              ou.activeContracts.length > 0 &&
              ["cas_pca", "cas_pma", "eczs_cas"].some((c) =>
                ou.activeContracts[0].codes.includes(c)
              )
            ) {
              return ou;
            } else if (ou.activeContracts && ou.activeContracts.length > 0) {
              return ou.ancestors !== undefined && ou.ancestors[1] !== undefined
                ? [{ id: ou.ancestors[1].id }]
                : []; // ceci est un temoin. On retourne la DPS ?
            }
            return (
              zone.organisationUnitGroups !== undefined &&
              ou.organisationUnitGroups.some((g) =>
                ["TODO"].includes(g.id)
              )
            );
          });
        }
      })
      .flat()
      .filter((ou) => ou)
      .map((ou) => {
        return periods.map((period) => {
          return {
            orgUnitId: ou.id,
            period: period,
            currentUserId: currentUser.id,
          };
        });
      })
      .flat();

    // clean-up duplicates
    const calculations = rawCalculations
      .map(JSON.stringify)
      .reverse()
      .filter(function (item, index, rawCalculations) {
        return rawCalculations.indexOf(item, index + 1) === -1;
      })
      .reverse()
      .map(JSON.parse);
    return calculations;
  }

  getDataApprovals(invoice, currentUser) {
    if (currentUser === undefined) {
      return [];
    }
    // check access rights and return "empty" ?
    let orgUnitIds = new Set();
    // all zs ids
    invoice.orgUnits.forEach((ou) => {
      // dps invoice
      if (ou.ancestors == undefined && ou.zoneOus) {
        for (let ouZone of ou.zoneOus) {
          if (ouZone.ancestors && ouZone.ancestors[2]) {
            orgUnitIds.add(ouZone.ancestors[2].id);
          }
        }
      }
      // indiv invoice or "classic consolidated" ?
      if (ou.ancestors && ou.ancestors[2]) {
        orgUnitIds.add(ou.ancestors[2].id);
      }
    });

    const dataApprovals = [];
    for (const orgUnitId of orgUnitIds) {
      for (const dataApprovalWorkflow of dataApprovalWorkflows) {
        const periods = DatePeriods.split(
          invoice.period,
          dataApprovalWorkflow.periodType.toLowerCase()
        );

        for (let period of periods) {
          dataApprovals.push({
            wf: dataApprovalWorkflow,
            period: period,
            orgUnit: orgUnitId,
          });
        }
      }
    }

    return dataApprovals;
  }
}

export default new Invoices();
