import axios from "axios";
import getEnvApi from "./get-env-api";
import store from "../store";

export function getConfig() {
  return axios.get(getEnvApi() + "/get-config/");
}

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

export function updateApp(
  appId,
  { name, region, chain, bandwidth_limit, storage_limit, cred, address }
) {
  return axios.post(
    getEnvApi() + "/api/update-app/?id=" + appId,
    {
      ID: appId,
      name,
      region,
      chain,
      bandwidth_limit,
      storage_limit,
      cred,
      address,
    },
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}

export function deleteCred(verifier) {
  return axios.get(
    getEnvApi() +
      "/api/delete-cred/?id=" +
      store.getters.appId +
      "&verifier=" +
      verifier,
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}

export function deleteApp() {
  return axios.delete(
    getEnvApi() + "/api/delete-app/?id=" + store.getters.appId,
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}
