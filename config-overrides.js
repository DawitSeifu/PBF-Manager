// react-app-rewired magic to override react webpack config
const path = require('path');

module.exports = function override(config, env) {
  config.resolve = {
    alias: {
      'd2': path.resolve('./node_modules/d2'),
      "@date-io/moment":path.resolve('./node_modules/@date-io/moment'),
      "bluesquare-components": path.resolve("./node_modules/bluesquare-components"),
      'react':  path.resolve('./node_modules/react'),
      'i18next': path.resolve('./node_modules/i18next'),
      'react-i18next': path.resolve('./node_modules/react-i18next'),
      "react-intl":path.resolve('./node_modules/react-intl'),
      "react-query":path.resolve('./node_modules/react-query'),
      'react-redux':  path.resolve('./node_modules/react-redux'),
      'react-table':  path.resolve('./node_modules/react-table'),
      '@material-ui':  path.resolve('./node_modules/@material-ui'),
      'xlsx-populate': path.resolve('./node_modules/xlsx-populate')
    }
  };
  return config;
};