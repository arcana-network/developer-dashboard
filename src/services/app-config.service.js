import axios from "axios";
import getEnvApi from "./get-env-api";
import store from "../store";
import { fetchAllApps, fetchApp } from "./dashboard.service";
import { getAddress } from "../utils/get-address";
import bytes from "bytes";

const UNLIMITED_BYTE_SIZE = bytes("10 TB");

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

export async function fetchAndStoreAppConfig() {
  const apps = await fetchAllApps();
  if (apps.data.length) {
    store.dispatch("updateAppConfigurationStatus", true);
    const currentApp = apps.data[0];
    const appId = currentApp.ID;
    store.dispatch("updateAppName", currentApp.name);
    store.dispatch("updateAppId", currentApp.ID);

    // Get Address
    const appAddress = await getAddress(currentApp.address);
    store.dispatch("updateSmartContractAddress", appAddress);

    const env = store.getters.env;
    const chainType = ["ethereum", "polygon", "binance"][currentApp.chain];
    store.dispatch(env + "/updateChainType", chainType);

    calculateAndStoreLimits({
      userLimit: currentApp.storage_limit,
      actionName: env + "/updateStorage",
    });

    calculateAndStoreLimits({
      userLimit: currentApp.bandwidth_limit,
      actionName: env + "/updateBandwidth",
    });

    const appDetails = await fetchApp(appId);

    if (appDetails.data.cred) {
      store.dispatch(
        env + "/updateAuthDetails",
        appDetails.data.cred.map((el) => {
          return {
            type: el.verifier,
            authType: el.verifier,
            verifier: el.verifier,
            clientId: el.clientId,
            clientSecret: el.clientSecret,
            redirectUrl: el.redirectUrl,
          };
        })
      );
    } else {
      store.dispatch(env + "/updateAuthDetails", []);
    }
  } else {
    store.dispatch("updateAppConfigurationStatus", false);
  }
}

function calculateAndStoreLimits({ userLimit, actionName }) {
  if (userLimit < UNLIMITED_BYTE_SIZE) {
    const isUnder1GB = userLimit < bytes("1 GB");

    const calculatedUserLimit = bytes(userLimit, {
      unitSeparator: " ",
      unit: isUnder1GB ? "MB" : "GB",
    });

    const userLimitValues = calculatedUserLimit.split(" ");
    store.dispatch(actionName, {
      value: userLimitValues[0],
      unit: userLimitValues[1],
      isUnlimited: false,
    });
  } else {
    store.dispatch(actionName, {
      value: "",
      unit: "",
      isUnlimited: true,
    });
  }
}
