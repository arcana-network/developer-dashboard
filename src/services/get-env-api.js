import store from "../store";
import constants from "../utils/constants";

export default function () {
  return store.getters.env === "test"
    ? constants.api.testnet
    : constants.api.mainnet;
}
