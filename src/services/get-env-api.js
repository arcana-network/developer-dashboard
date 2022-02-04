import store from "../store";
import constants from "../utils/constants";

const CURRENT_API_VERSION = import.meta.env.VITE_CURRENT_API_VERSION;

export default function (version) {
  let apiEndpoint =
    store.getters.env === "test"
      ? constants.api.testnet
      : constants.api.mainnet;

  if (version === false) {
    return apiEndpoint;
  }

  if (typeof version !== "string" || !version.trim()) {
    version = CURRENT_API_VERSION;
  }

  if (!apiEndpoint.endsWith("/")) {
    apiEndpoint += "/";
  }
  return apiEndpoint + "api/" + version;
}
