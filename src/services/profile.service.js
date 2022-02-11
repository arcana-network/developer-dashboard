import axios from "axios";
import getEnvApi from "./get-env-api";
import store from "../store";

export function fetchProfile() {
  return axios.get(getEnvApi() + "/profile/", {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function updateOrganization({ name, country, size, region }) {
  return axios.post(
    getEnvApi() + "/update-organization/",
    { name, country, size, region },
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}
