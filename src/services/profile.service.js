import axios from "axios";
import getEnvApi from "./get-env-api";
import store from "../store";

export function fetchProfile() {
  return axios.get(getEnvApi() + "/api/profile/", {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
}

export function updateOrganization({ name, country, size, region }) {
  return axios.post(
    getEnvApi() + "/api/update-organization/",
    { name, country, size, region },
    {
      headers: {
        Authorization: "Bearer " + store.getters.accessToken,
      },
    }
  );
}
