const programs = {
  askin: {
    name: "Askin",
    startPeriod: "201901",
    endPeriod: "201912",
  },
  pvsbg: {
    name: "PVSBG",
    startPeriod: "201601",
    endPeriod: "201912",
  },
  nk: {
    name: "Nord Kivu",
    startPeriod: "202010",
    endPeriod: "204012",
  },
};

const EVALIMPACT_NON_TEMOIN = [
  "askin_pca",
  "askin_pma",
  "cas_pca",
  "cas_pma",
  "groupe_ie_par_defaut_pca",
  "groupe_ie_par_defaut_pma",
  "pvsbg_nk_pca",
  "pvsbg_nk_pma",
  "pvsbg_sk_pca",
  "pvsbg_sk_pma",
];

const EVALIMPACT_TEMOIN = ["temoins_pma", "temoins_pca"];

const NK_ID = "pIAYIpy4hiH";
const SK_ID = "GnLX8MNgxZw";

function findZoneContract(context, contract) {
  const zoneAncestorId =
    contract.orgUnit &&
    contract.orgUnit.ancestors &&
    contract.orgUnit.ancestors[2] &&
    contract.orgUnit.ancestors[2].id;
  if (zoneAncestorId == undefined) {
    return [];
  }
  if (context.cache.zoneContracts == undefined) {
    context.cache.zoneContracts = {};
  }
  if (context.cache.zoneContracts[zoneAncestorId]) {
    return context.cache.zoneContracts[zoneAncestorId];
  }
  context.cache.zoneContracts[zoneAncestorId] = context.contracts.filter(
    (c) => contract.orgUnit && zoneAncestorId && c.orgUnit.id == zoneAncestorId
  );
  return context.cache.zoneContracts[zoneAncestorId];
}

const isEqual = (contract, field, value) => {
  const val = contract.fieldValues[field];
  return val && val == value;
};

const isIn = (contract, field, values) => {
  const value = contract.fieldValues[field];
  return value && values.includes(value);
};

const asPeriod = (dateString) => {
  if (dateString == undefined) {
    return undefined;
  }
  return dateString.replace("-", "").slice(0, 6);
};

const PBVSBG = ["pvsbg_nk_pca", "pvsbg_nk_pma", "pvsbg_sk_pma", "pvsbg_sk_pca"];
const CAS = ["cas_pma", "cas_pca"];
const ASKIN_CAS = ["askin_pca", "askin_pma"];
const SpecificContractValidator = (contract, context) => {
  const errors = [];
  const orgUnit = contract.orgUnit || contract.fieldValues.orgUnit;

  const isNK = !!(orgUnit && orgUnit.path && orgUnit.path.includes(NK_ID));
  const isSK = !!(orgUnit && orgUnit.path && orgUnit.path.includes(SK_ID));
  const isAAP_PVSBG = isEqual(contract, "fbp_aap", "aap_pvsbg");
  const isAAP_NK = isEqual(contract, "fbp_aap", "aap_nk");
  const isEvalImpactPvsbgSKorNK = isIn(contract, "evaluation_d_impact", PBVSBG);
  const isEvalImpactCasPMACasPca = isIn(contract, "evaluation_d_impact", CAS);
  const isAskin = isIn(contract, "evaluation_d_impact", ASKIN_CAS);
  const isEvalImpactTemoinPMATemoinPca = isIn(
    contract,
    "evaluation_d_impact",
    EVALIMPACT_TEMOIN
  );

  const isECZSCas = isIn(contract, "evaluation_d_impact", ["eczs_cas"]);

  const isZoneTemoin = isIn(contract, "zones_pdss_pvsbg", ["zones_temoins"]);

  let program = undefined;
  if (isAskin) {
    program = "askin";
  } else if (isEvalImpactPvsbgSKorNK || isAAP_PVSBG) {
    program = "pvsbg";
  } else if (isAAP_NK) {
    program = "nk";
  }

  if (isEvalImpactTemoinPMATemoinPca) {
    if (
      contract.fieldValues.evaluation_d_impact === "temoins_pma" &&
      contract.fieldValues.type_fosa !== "pma"
    ) {
      errors.push({
        field: ["type_fosa"],
        errorCode: "required",
        message:
          "Le type d'évaluation Témoins PMA doit être associé au type FOSA PMA.",
      });
    }

    if (
      contract.fieldValues.evaluation_d_impact === "temoins_pca" &&
      contract.fieldValues.type_fosa !== "pca"
    ) {
      errors.push({
        field: ["type_fosa"],
        errorCode: "required",
        message:
          "Le type d'évaluation Témoins PCA doit être associé au type FOSA PCA.",
      });
    }
  }

  if (
    contract &&
    contract.fieldValues &&
    contract.fieldValues.zones_pdss_pvsbg &&
    contract.fieldValues.type_fosa != "zs"
  ) {
    errors.push({
      field: "zones_pdss_pvsbg",
      errorCode: "required",
      message:
        "Le champs zone pdss/pvsbg ne peut être remplit que pour les zone de santé",
    });
  }
  if (
    context.contracts &&
    isIn(contract, "evaluation_d_impact", EVALIMPACT_NON_TEMOIN)
  ) {
    const zoneContracts = findZoneContract(context, contract);
    if (zoneContracts.length > 0) {
      const zoneContract = zoneContracts.find((z) =>
        z.matchPeriod(contract.startPeriod)
      );
      if (zoneContract) {
        const isZoneTemoin = isIn(zoneContract, "zones_pdss_pvsbg", [
          "zones_temoins",
        ]);
        if (isZoneTemoin) {
          errors.push({
            field: "evaluation_d_impact",
            errorCode: "required",
            message:
              "Une orgunit cas ne peut être dans une zone témoin : " +
              zoneContract.orgUnit.name,
          });
        }
      }
    }
  }
  if (context.contracts && isZoneTemoin) {
    const contractsInZoneNotTemoin = context.contracts.filter(
      (c) =>
        c.orgUnit.path.includes(contract.orgUnit.id) &&
        isIn(c, "evaluation_d_impact", EVALIMPACT_NON_TEMOIN)
    );
    if (contractsInZoneNotTemoin.length > 0) {
      errors.push({
        field: "zones_pdss_pvsbg",
        errorCode: "required",
        message:
          "Une zone témoin ne peut contenir des orgunits cas : " +
          contractsInZoneNotTemoin
            .map((c) => c.orgUnit.name + " (" + c.orgUnit.id + ")")
            .join(" , "),
      });
    }
  }

  const isZoneCas = isIn(contract, "zones_pdss_pvsbg", ["zones_cas"]);
  if (context.contracts && isZoneCas) {
    let contractsInZoneNotTemoin = context.contracts.filter(
      (c) =>
        c.orgUnit.path.includes(contract.orgUnit.id) &&
        isIn(c, "evaluation_d_impact", EVALIMPACT_TEMOIN)
    );
    contractsInZoneNotTemoin = contractsInZoneNotTemoin.filter(z => z && z.matchPeriod(contract.startPeriod))
    
    if (contractsInZoneNotTemoin.length > 0) {
      errors.push({
        field: "zones_pdss_pvsbg",
        errorCode: "required",
        message:
          "Une zone cas ne peut contenir des orgunits témoins : " +
          contractsInZoneNotTemoin
            .map((c) => c.orgUnit.name + " (" + c.orgUnit.id + ")")
            .join(" , "),
      });
    }
  }

  if (
    context.contracts &&
    isIn(contract, "evaluation_d_impact", EVALIMPACT_TEMOIN)
  ) {
    const zoneContracts = findZoneContract(context, contract);

    if (zoneContracts.length > 0) {
      const zoneContract = zoneContracts.find((z) =>
        z.matchPeriod(contract.startPeriod)
      );
      if (zoneContract) {
        const isZoneTemoin = isIn(zoneContract, "zones_pdss_pvsbg", [
          "zones_cas",
        ]);
        if (isZoneTemoin) {
          errors.push({
            field: "evaluation_d_impact",
            errorCode: "required",
            message:
              "Une orgunit témoin ne peut être dans une zone cas : " +
              zoneContract.orgUnit.name,
          });
        }
      }
    }
  }
  const contractStartPeriod = asPeriod(
    contract.fieldValues.contract_start_date
  );
  const contractEndPeriod = asPeriod(contract.fieldValues.contract_end_date);

  if (program && programs[program]) {
    const programStartPeriod = programs[program].startPeriod;
    const programEndPeriod = programs[program].endPeriod;

    const message = `Le programme '${programs[program].name}' est limité de ${programStartPeriod} à ${programEndPeriod} vs contrat ${contractStartPeriod}-${contractEndPeriod}`;
    if (contractStartPeriod && contractStartPeriod < programStartPeriod) {
      errors.push({
        field: "contract_start_date",
        errorCode: "required",
        message: message,
      });
    }
    if (contractEndPeriod && contractEndPeriod > programEndPeriod) {
      errors.push({
        field: "contract_end_date",
        errorCode: "required",
        message: message,
      });
    }
  }

  if (isAAP_PVSBG && !isNK && !isSK) {
    errors.push({
      field: "evaluation_d_impact",
      errorCode: "required",
      message: "PVSBG est limité au Nord et Sud Kivu",
    });
  }

  if (isEvalImpactPvsbgSKorNK && !isNK && !isSK) {
    errors.push({
      field: "evaluation_d_impact",
      errorCode: "required",
      message: "PVSBG est limité au Nord et Sud Kivu",
    });
  }

  if (isAAP_PVSBG && !isEvalImpactPvsbgSKorNK & !!isECZSCas) {
    errors.push({
      field: "evaluation_d_impact",
      errorCode: "invalid",
      message: `L'évaluation d'impact doit être limitée au cas PVSBG NK/SK PMA/PCA : ${contract.fieldValues.evaluation_d_impact}`,
    });
  }

  if (isAAP_NK && !isEvalImpactCasPMACasPca) {
    errors.push({
      field: "evaluation_d_impact",
      errorCode: "invalid",
      message: "L'évaluation d'impact doit être limitée au Cas PMA/PCA",
    });
  }

  if (
    contract.fieldValues.equite_fbr == undefined &&
    isEvalImpactCasPMACasPca &&
    contractEndPeriod &&
    contractEndPeriod > "2016"
  ) {
    errors.push({
      field: "equite_fbr",
      errorCode: "required",
      message: "La categorie d'équité est obligatoire",
    });
  }

  return errors;
};

export default SpecificContractValidator;
