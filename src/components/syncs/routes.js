import React from "react";

import { Route } from "react-router-dom";

import SyncDataApprovalWorflow from "./SyncDataApprovalWorflow";
import SyncGroups from "./SyncGroups";

export const routes = (props) => {
  return [
    <Route
      key="sync-approvals"
      exact
      path="/sync/approvals"
      render={(routerProps) => {
        return <SyncDataApprovalWorflow {...props} />;
      }}
    />,
    <Route
      key="sync-groups"
      exact
      path="/sync/groups/:period"
      render={(routerProps) => {
        return <SyncGroups {...props} />;
      }}
    />,
  ];
};
