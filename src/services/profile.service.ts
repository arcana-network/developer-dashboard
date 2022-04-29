import axios from 'axios'

import getEnvApi from '@/services/get-env-api'
import store from '@/store'

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
