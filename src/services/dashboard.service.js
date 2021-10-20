import axios from "axios";
import constants from "../utils/constants";
import getEnvApi from "./get-env-api";
import store from "../store";

export function fetchAllApps() {
  return axios.get(getEnvApi() + "/api/user-app/", {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function fetchApp(appId) {
  return axios.get(getEnvApi() + "/api/get-app/?id=" + appId, {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function fetchStats(appId) {
  return axios.get(getEnvApi() + "/api/overview/?id=" + appId, {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function fetchPeriodicUsage(appId, period = "month") {
  return axios.get(
    getEnvApi() + "/api/app-usage/?id=" + appId + "&period=" + period,
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}
