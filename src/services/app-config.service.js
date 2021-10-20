import axios from "axios";
import getEnvApi from "./get-env-api";
import store from "../store";

export function createApp({
  name,
  region,
  chain,
  bandwidth_limit,
  storage_limit,
  cred,
}) {
  return axios.post(
    getEnvApi() + "/api/create-app/",
    {
      name,
      region,
      chain,
      bandwidth_limit,
      storage_limit,
      cred,
    },
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}

export function fetchAppDetails(appId) {
  return axios.get();
}

export function updateApp() {
  return axios.post();
}

export function deleteApp() {
  return axios.delete();
}
