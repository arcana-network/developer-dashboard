import axios from "axios";
import getEnvApi from "./get-env-api";
import store from "../store";

export function fetchAllUsers() {
  return axios.get(
    getEnvApi() + "/api/user-details/?id=" + store.getters.appId,
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}
