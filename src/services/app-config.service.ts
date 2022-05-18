import axios from 'axios'

import store from '@/store'
import getEnvApi from '@/utils/get-env-api'

function getConfig() {
  return axios.get(getEnvApi() + '/get-config/')
}

function deleteCred(verifier: string) {
  return axios.get(
    getEnvApi() +
      '/delete-cred/?id=' +
      store.getters.appId +
      '&verifier=' +
      verifier,
    {
      headers: {
        Authorization: 'Bearer ' + store.getters.accessToken,
      },
    }
  )
}

const appConfigService = {
  getConfig,
  deleteCred,
}

export default appConfigService
