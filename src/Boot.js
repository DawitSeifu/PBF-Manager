import { PluginRegistry } from "@blsq/blsq-report-components";
import { plugins } from "./plugins";

const boot = () => {
  plugins.forEach((plugin) => {
    console.log("registering plugin ", plugin)

    PluginRegistry.register(plugin)
  });
};

export default boot;
