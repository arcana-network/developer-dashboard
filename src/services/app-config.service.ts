import axios from 'axios'
import bytes from 'bytes'

import dashboardService from '@/services/dashboard.service'
import getEnvApi from '@/services/get-env-api'
import store from '@/store'

const UNLIMITED_BYTE_SIZE = bytes('10 TB')
const CHAIN_TYPES = ['ethereum', 'polygon', 'binance']

function getConfig() {
  return axios.get(getEnvApi() + '/get-config/')
}

function createApp({
  name,
  region,
  chain,
  bandwidth_limit,
  storage_limit,
  cred,
  aggregate_login,
}) {
  return axios.post(
    getEnvApi() + '/create-app/',
    {
      name,
      region,
      chain,
      bandwidth_limit,
      storage_limit,
      cred,
      aggregate_login,
    },
    {
      headers: {
        Authorization: 'Bearer ' + store.getters.accessToken,
      },
    }
  )
}

function updateApp(
  appId,
  { name, region, chain, bandwidth_limit, storage_limit, cred, address }
) {
  return axios.post(
    getEnvApi() + '/update-app/?id=' + appId,
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
        Authorization: 'Bearer ' + store.getters.accessToken,
      },
    }
  )
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

async function fetchAndStoreAppConfig() {
  const apps = await dashboardService.fetchAllApps()
  if (apps.data.length) {
    store.dispatch('updateAppConfigurationStatus', true)
    const currentApp = apps.data[0]
    const appId = currentApp.ID
    store.dispatch('updateAppName', currentApp.name)
    store.dispatch('updateAppId', currentApp.ID)

    const appAddress = currentApp.address
    store.dispatch('updateSmartContractAddress', appAddress)

    const env = store.getters.env
    const chainType = CHAIN_TYPES[currentApp.chain]
    store.dispatch(env + '/updateChainType', chainType)

    const hasAggregateLogin = currentApp.aggregate_login
    store.dispatch(env + '/updateAggregateLogin', hasAggregateLogin)

    calculateAndStoreLimits({
      userLimit: currentApp.storage_limit,
      actionName: env + '/updateStorage',
    })

    calculateAndStoreLimits({
      userLimit: currentApp.bandwidth_limit,
      actionName: env + '/updateBandwidth',
    })

    const appDetails = await dashboardService.fetchApp(appId)

    if (appDetails.data.cred) {
      store.dispatch(
        env + '/updateAuthDetails',
        appDetails.data.cred.map((el) => {
          return {
            type: el.verifier,
            authType: el.verifier,
            verifier: el.verifier,
            clientId: el.clientId,
            clientSecret: el.clientSecret,
            origin: el.origin,
            redirectUrl: el.redirectUrl,
          }
        })
      )
    } else {
      store.dispatch(env + '/updateAuthDetails', [])
    }
  } else {
    store.dispatch('updateAppConfigurationStatus', false)
  }
}

function calculateAndStoreLimits({ userLimit, actionName }) {
  if (userLimit < UNLIMITED_BYTE_SIZE) {
    const isUnder1GB = userLimit < bytes('1 GB')

    const calculatedUserLimit = bytes(userLimit, {
      unitSeparator: ' ',
      unit: isUnder1GB ? 'MB' : 'GB',
    })

    const userLimitValues = calculatedUserLimit.split(' ')
    store.dispatch(actionName, {
      value: userLimitValues[0],
      unit: userLimitValues[1],
      isUnlimited: false,
    })
  } else {
    store.dispatch(actionName, {
      value: '',
      unit: '',
      isUnlimited: true,
    })
  }
}

const appConfigService = {
  getConfig,
  createApp,
  updateApp,
  deleteCred,
  deleteApp,
  fetchAndStoreAppConfig,
}

export default appConfigService
