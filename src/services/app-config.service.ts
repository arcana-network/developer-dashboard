import axios from 'axios'
import bytes from 'bytes'

import store from '@/store'
import getEnvApi from '@/utils/get-env-api'

const UNLIMITED_BYTE_SIZE = bytes('10 TB')
const CHAIN_TYPES = ['ethereum', 'polygon', 'binance']

function getConfig() {
  return axios.get(getEnvApi() + '/get-config/')
}

function deleteCred(verifier) {
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

function deleteApp() {
  return axios.delete(getEnvApi() + '/delete-app/?id=' + store.getters.appId, {
    headers: {
      Authorization: 'Bearer ' + store.getters.accessToken,
    },
  })
}

const appConfigService = {
  getConfig,
  deleteCred,
  deleteApp,
}

export default appConfigService
