import axios from 'axios'

import store from '@/store'
import getEnvApi from '@/utils/get-env-api'

function fetchProfile() {
  return axios.get(getEnvApi() + '/profile/', {
    headers: {
      Authorization: 'Bearer ' + store.getters.accessToken,
    },
  })
}

function updateOrganization({ name, country, size, region }) {
  return axios.post(
    getEnvApi() + '/update-organization/',
    { name, country, size, region },
    {
      headers: {
        Authorization: 'Bearer ' + store.getters.accessToken,
      },
    }
  )
}

const profileService = {
  fetchProfile,
  updateOrganization,
}

export default profileService
