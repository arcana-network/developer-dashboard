import axios from "axios";
import getEnvApi from "./get-env-api";
import store from "@/store";

export function fetchAllUsers() {
  return axios.get(getEnvApi() + "/user-details/?id=" + store.getters.appId, {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function searchUsers(address) {
  return axios.get(
    getEnvApi() +
      "/user-transactions/?id=" +
      store.getters.appId +
      "&address=" +
      address,
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}

export function fetchAllUserTransactions(userAddress) {
  return axios.get(
    getEnvApi() +
      "/user-transactions/?id=" +
      store.getters.appId +
      "&address=" +
      userAddress,
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}

export function fetchMonthlyUsers() {
  return axios.get(getEnvApi() + "/no-of-users/?id=" + store.getters.appId, {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}
