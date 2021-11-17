import axios from "axios";
import { AuthProvider } from "@arcana/auth";
import constants from "../utils/constants";
import getEnvApi from "./get-env-api";

const arcanaAuth = new AuthProvider({
  appID: constants.arcanaAppId,
  network: "testnet",
  oauthCreds: [
    {
      type: "google",
      clientId: constants.sso.google.clientId,
    },
    {
      type: "twitch",
      clientId: constants.sso.twitch.clientId,
    },
    {
      type: "discord",
      clientId: constants.sso.discord.clientId,
    },
    {
      type: "reddit",
      clientId: constants.sso.reddit.clientId,
    },
    {
      type: "twitter",
      clientId: constants.sso.twitter.clientId,
    },
    {
      type: "github",
      clientId: constants.sso.github.clientId,
    },
  ],
  redirectUri: constants.ssoRedirectUrl,
});

export function getArcanaAuth() {
  return arcanaAuth;
}

export function logout() {
  arcanaAuth.logout();
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
