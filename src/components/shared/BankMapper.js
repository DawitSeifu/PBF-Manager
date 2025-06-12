const activities = [
  {
    name: "Titulaire de compte",
    de_id: "nejl78Itnmo",
    code: "titulaire_de_compte",
  },
  {
    name: "Banque",
    de_id: "cDfvRnH8gTf",
    code: "nom_de_la_banque",
  },
  {
    name: "Numéro de compte",
    de_id: "J6y2RnzdScQ",
    code: "numero_de_compte",
  },
  {
    name: "Agence de banque",
    de_id: "gkcjh3ujsKL",
    code: "agence_de_banque",
  },
  {
    name: "Code TomPro",
    de_id: "sCZSHVq3UNS",
    code: "code_tompro",
  },
];

class BankMapper {
  static mapBankInfos(values, year, ou, bankPackage) {
    const activitiesByCode = {};
    activities.forEach((act) => (activitiesByCode[act.code] = act));
    const payload = {
      nomDeLaBanque: this.mapBankInfo(
        values,
        activitiesByCode["nom_de_la_banque"],
        ou,
        year
      ),
      agenceDeBanque: this.mapBankInfo(
        values,
        activitiesByCode["agence_de_banque"],
        ou,
        year
      ),
      titulaireDeCompte: this.mapBankInfo(
        values,
        activitiesByCode["titulaire_de_compte"],
        ou,
        year
      ),
      numeroDeCompte: this.mapBankInfo(
        values,
        activitiesByCode["numero_de_compte"],
        ou,
        year
      ),
      accountNumber: this.mapBankInfo(
        values,
        activitiesByCode["numero_de_compte"],
        ou,
        year
      ),
      codeTompro: this.mapBankInfo(
        values,
        activitiesByCode["code_tompro"],
        ou,
        year
      ),
    };

    return payload;
  }

  static mapBankInfo(values, de, ou, period) {
    const bankInfo = values.textByOrgUnit(de.de_id, ou.id, period)

    return {
      code: de.de_id,
      name: de.name,
      period: period,
      value: bankInfo === undefined ? "" : bankInfo.value,
    };
  }
}

export default BankMapper;
