import React from "react";
import { useSelector } from "react-redux";
import { EditIasoFormButton as DefaultIasoButton } from "@blsq/blsq-report-components";

const EditIasoFormButton = ({ formId, period, orgUnitId }) => {
  const iasoToken = "aa2f594f-3d47-4c09-aaaa-85fb0b4add32";
  const currentUser = useSelector((state) => state.currentUser.profile);
  return (
    <DefaultIasoButton
      iasoUrl={"https://pbf.moh.gov.et"}
      iasoToken={iasoToken}
      formId={formId}
      currentUserId={currentUser.id}
      period={period}
      orgUnitId={orgUnitId}
    />
  );
};

export default EditIasoFormButton;
