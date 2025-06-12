import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Logout from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import NetworkCheck from "@material-ui/icons/NetworkCheck";
import incentivesDescriptors from "../data/incentives-descriptors.json";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DatePeriods } from "@blsq/blsq-report-components";

function currentQuarter() {
  let currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 8);
  currentDate.setMonth(currentDate.getMonth() + 6);
  return (
    currentDate.getFullYear() +
    "NovQ" +
    DatePeriods.quarterByMonth(currentDate.getMonth() + 1)
  );
};

export const DrawerLinks = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const SET_CURRENT_PERIOD = "SET_CURRENT_PERIOD";

    const setCurrentPeriod = (payload) => ({
      type: SET_CURRENT_PERIOD,
      payload,
    });
    dispatch(setCurrentPeriod(currentQuarter()));
  }, []);

  return [
    <ListItem
      key="contracts"
      button
      component="a"
      href={"./index.html#/contracts"}
    >
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary={"Contracts"} />
    </ListItem>,
    <ListItem
      button
      component="a"
      href={
        "./index.html#/incentives/" +
        props.period +
        "/" +
        incentivesDescriptors[0].dataSet
      }
    >
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Incentives" />
    </ListItem>,

    <ListItem
      button
      key="sync-dataset"
      component="a"
      href={"./index.html#/sync/datasets/" + props.period}
    >
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Sync dataSets" />
    </ListItem>,

    <ListItem
      button
      key="sync-program-groups"
      component="a"
      href={"./index.html#/sync/program-groups/" + props.period}
    >
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Sync Groups" />
    </ListItem>,

    <ListItem
      button
      key="logout"
      component="a"
      href="../../../dhis-web-commons-security/logout.action"
    >
      <ListItemIcon>
        <Logout />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>,
  ];
};

export default DrawerLinks;
