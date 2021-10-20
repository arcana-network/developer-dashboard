import axios from "axios";
import constants from "../utils/constants";
import getEnvApi from "./get-env-api";

const { AuthProvider } = window.arcana_login;
const arcanaAuth = new AuthProvider({
  appID: constants.arcanaAppId,
  oauthCreds: [
    {
      type: "google",
      clientId: constants.sso.google.clientId,
      redirectUri: constants.ssoRedirectUrl,
    },
    {
      type: "twitch",
      clientId: constants.sso.twitch.clientId,
      redirectUri: constants.ssoRedirectUrl,
    },
    {
      type: "discord",
      clientId: constants.sso.discord.clientId,
      redirectUri: constants.ssoRedirectUrl,
    },
    {
      type: "reddit",
      clientId: constants.sso.reddit.clientId,
      redirectUri: constants.ssoRedirectUrl,
    },
    {
      type: "twitter",
      clientId: constants.sso.twitter.clientId,
      redirectUri: constants.ssoRedirectUrl,
    },
    {
      type: "github",
      clientId: constants.sso.github.clientId,
      redirectUri: constants.ssoRedirectUrl,
    },
  ],
});

export function getArcanaAuth() {
  return arcanaAuth;
}

export function logout() {
  arcanaAuth.clearSession();
  sessionStorage.clear();
}

export function getNonce(address) {
  return axios.get(getEnvApi() + "/get-nonce/?address=" + address);
}

export function login({ signature, email, address }) {
  return axios.post(getEnvApi() + "/login/", {
    signature,
    email,
    address,
  });
}
