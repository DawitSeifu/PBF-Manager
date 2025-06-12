import React from "react";
import "./style.css";
import { withTranslation } from "react-i18next";
import { PercentCell } from "../shared/Cells";
import { Cell } from "@blsq/blsq-report-components";

const AmountCell = props => {
  return (
    <Cell
      variant="money"
      noWrap="true"
      decimals={0}
      separator=" "
      {...props}
      style={{ border: "0px", textAlign: "right", padding: "5px 5px 0px 5px" }}

    />
  );
};

function Totals(props) {
  const { totals, t } = props;
  return [
    <tr key="1">
      <td className="total">{t("invoice:total1")}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <AmountCell className="total" value={totals} field="total_quantity" bold width="5%" />
    </tr>,
    <tr key="2">
      <td className="intermediate">
        <span>{t("invoice:equity_bonus")}</span> (= total1 x{" "}
        <AmountCell
          value={totals}
          field="equity_bonus_percentage"
          element="span"
        />{" "}
        % )
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <AmountCell value={totals} field="equity_bonus_amount" />
    </tr>,
    <tr key="3">
      <td className="total" noWrap="true">
        Total 2 = total 1 + <span>{t("invoice:equity_bonus")}</span>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <AmountCell className="total" value={totals} field="total_with_equity" bold />
    </tr>,

    <tr key="4">
      <td></td>
      <td></td>
      <td className="subheader">{t("invoice:score")}</td>
      <td className="subheader">{t("invoice:weight")}</td>
      <td className="subheader" noWrap="true">
        {t("invoice:weighted_score")}
      </td>
      <td></td>
    </tr>,
    <tr key="5">
      <td className="intermediate">{t("invoice:quality_assessment")}</td>
      <td></td>
      <PercentCell value={totals} field="total_technical_quality"></PercentCell>
      <td>35%</td>
      <PercentCell value={totals} field="total_technical_quality_weighted" />
      <td></td>
    </tr>,
    <tr key="6">
      <td className="intermediate">{t("invoice:quality_community")}</td>
      <td></td>
      <PercentCell value={totals} field="amount_patient_satisfaction" />
      <td>35%</td>
      <PercentCell
        value={totals}
        field="amount_patient_satisfaction_weighted"
      />
      <td></td>
    </tr>,
    <tr key="7">
      <td className="intermediate">{t("invoice:indice_tool")}</td>
      <td></td>
      <PercentCell value={totals} field="amount_index_tool" />
      <td>30%</td>
      <PercentCell value={totals} field="amount_index_tool_weighted" />
      <td></td>
    </tr>,
    <tr key="8">
      <td></td>
      <td></td>
      <td className="subheader2" noWrap>
        <span>{t("invoice:month1")}</span>
      </td>
      <td className="subheader2" noWrap>
        {t("invoice:month2")}
      </td>
      <td className="subheader2" noWrap>
        {t("invoice:thismonth")}
      </td>
      <td className="subheader2">{t("invoice:quarter")}</td>
    </tr>,
    <tr key="9">
      <td className="intermediate">{t("invoice:quarterly_production")}</td>
      <td></td>
      <AmountCell value={totals} field="total_with_equity_month1" />
      <AmountCell value={totals} field="total_with_equity_month2" />
      <AmountCell value={totals} field="total_with_equity_current" />
      <AmountCell value={totals} field="quaterly_quantity_production" />
    </tr>,
    <tr key="9b">
      <td className="intermediate">
        <span>{t("invoice:quarterly_quality_bonus")}</span> ={" "}
        <span>{t("invoice:quarterly_production")}</span> ({" "}
        <AmountCell
          value={totals}
          field="quaterly_quantity_production"
          element="span"
        />
        ) x 15% x <span>{t("invoice:quality_score")}</span> (
        {
          <PercentCell
            value={totals}
            field="total_quality_score"
            element="span"
          />
        }
        ) %
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <AmountCell value={totals} field="quality_bonus" width="5%" />
    </tr>,
    <tr key="10">
      <td className="total" noWrap="true">
        Total 3 = Total 2 + <span>{t("invoice:quarterly_quality_bonus")}</span>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <AmountCell
        className="total"
        value={totals}
        field="total_quantity_and_quality"
        bold
      />
    </tr>,
    <tr key="11">
      <td className="intermediate">{t("invoice:baq_bonus")}</td>
      <td></td>
      <AmountCell value={totals} field="baq_verified" />
      <td></td>
      <AmountCell value={totals} field="baq_price" />
      <AmountCell value={totals} field="amount_baq" />
    </tr>,
    <tr key="12">
      <td className="total">{t("invoice:total_general")}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <AmountCell className="total" value={totals} field="total_payment" bold />
    </tr>,
    totals.subsidiesEarned ? (
      <tr key="13">
        <td className="total" noWrap="true">
          {t("invoice:total_general")}
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <AmountCell
          className="total"
          value={totals}
          field="subsidiesEarned"
          bold
        />
      </tr>
    ) : (
      <tr key="14"></tr>
    ),
    <tr key="15">
      <td colSpan={6}>{t("invoice:nb_note")}</td>
    </tr>
  ];
}

export default withTranslation()(Totals);
