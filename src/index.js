import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// opt out for the moment : import registerServiceWorker from "./registerServiceWorker";

import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
const customPalette = createTheme({
  palette: {
    primary: {
      light: "#5d94c7",
      main: "#266696",
      dark: "#003c68",
      contrastText: "#fff"
    },
    secondary: {
      light: "#5d94c7",
      main: "#266696",
      dark: "#003c68",
      contrastText: "#fff"
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={customPalette}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);
// opt out for the moment : registerServiceWorker();
