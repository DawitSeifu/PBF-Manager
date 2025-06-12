import React from "react";

import {
  Dhis2Input,
  CompleteDataSetButton,
} from "@blsq/blsq-report-components";

const BankInfoForm = (props) => {
  return (
    <div>
      <h1>Information bancaires</h1>
      <table className="table-striped">
        <tbody>
          <tr>
            <td width="300px">Agence de banque</td>
            <td width="530px">
              <Dhis2Input
                fullWidth
                dataElement="gkcjh3ujsKL"
              />
            </td>
          </tr>
          <tr>
            <td>Banque</td>
            <td>
              <Dhis2Input dataElement="cDfvRnH8gTf" fullWidth />
            </td>
          </tr>
          <tr>
            <td>Numéro de compte</td>
            <td>
              <Dhis2Input dataElement="J6y2RnzdScQ" fullWidth/>
            </td>
          </tr>
          <tr>
            <td>Titulaire de compte</td>
            <td>
              <Dhis2Input dataElement="nejl78Itnmo" fullWidth />
            </td>
          </tr>
        </tbody>
      </table>
      <h1>Information comptable TomPro</h1>
      <table className="table-striped">
        <tbody>
          <tr>
            <td>Libellé TomPro (nom de la structure dans TomPro)</td>
            <td>
              <Dhis2Input dataElement="W8yYhpmiDlH" fullWidth/>
            </td>
          </tr>
          <tr>
            <td>Code TomPro (compte NON bancaire commencant par 40...)</td>
            <td width={"400px"}>
              <Dhis2Input dataElement="sCZSHVq3UNS" fullWidth/>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              <br></br>
              <CompleteDataSetButton></CompleteDataSetButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BankInfoForm;
