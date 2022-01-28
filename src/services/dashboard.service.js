import axios from "axios";
import constants from "../utils/constants";
import getEnvApi from "./get-env-api";
import store from "../store";

export function fetchAllApps() {
  return axios.get(getEnvApi() + "/user-app/", {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function fetchApp(appId) {
  return axios.get(getEnvApi() + "/get-app/?id=" + appId, {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function fetchStats(appId) {
  return axios.get(getEnvApi() + "/overview/?id=" + appId, {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function fetchPeriodicUsage(period = "month") {
  return axios.get(
    getEnvApi() + "/app-usage/?id=" + store.getters.appId + "&period=" + period,
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}
