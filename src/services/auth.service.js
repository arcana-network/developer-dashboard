import axios from "axios";
import jsonp from "jsonp";

import { AuthProvider } from "@arcana/auth";
import constants from "../utils/constants";
import getEnvApi from "./get-env-api";

const authConfig = {
  appID: constants.arcanaAppId,
  flow: "redirect",
  redirectUri: `${window.location.origin}/oauth/redirect`,
};

export async function getArcanaAuth() {
  return await AuthProvider.init(authConfig);
}

export async function logout() {
  const arcanaAuth = await getArcanaAuth();
  await arcanaAuth.logout();
  sessionStorage.clear();
}

export function getNonce(address) {
  return axios.get(getEnvApi(false) + "/get-nonce/?address=" + address);
}

export function login({ signature, email, address }) {
  return axios.post(getEnvApi(false) + "/login/", {
    signature,
    email,
    address,
  });
}

export function addUserToMailchimp(email) {
  const mailchimpGroup = import.meta.env.VITE_MAILCHIMP_GROUP;
  const mailchimpDevPortalId = import.meta.env.VITE_MAILCHIMP_DEV_PORTAL_ID;

  const data = {
    u: import.meta.env.VITE_MAILCHIMP_USER_ID,
    id: import.meta.env.VITE_MAILCHIMP_LIST_ID,
    EMAIL: email,
    [`${mailchimpGroup}[${mailchimpDevPortalId}]`]: mailchimpDevPortalId,
  };

  const stringifiedData = new URLSearchParams(data).toString();

  const url = `${import.meta.env.VITE_MAILCHIMP_LIST_URL}?${stringifiedData}`;
  jsonp(url, { param: "c" }, (error) => {
    if (error) {
      console.error(error);
    }
  });
}
