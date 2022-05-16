import axios from 'axios'

import store from '@/store'
import getEnvApi from '@/utils/get-env-api'

function fetchAllApps() {
  return axios.get(getEnvApi() + '/user-app/', {
    headers: {
      Authorization: 'Bearer ' + store.getters.accessToken,
    },
  })
}

function fetchApp(appId: string | number) {
  return axios.get(getEnvApi() + '/get-app/?id=' + appId, {
    headers: {
      Authorization: 'Bearer ' + store.getters.accessToken,
    },
  })
}

function fetchStats(appId: string | number) {
  return axios.get(getEnvApi() + '/overview/?id=' + appId, {
    headers: {
      Authorization: 'Bearer ' + store.getters.accessToken,
    },
  })
}

function fetchPeriodicUsage(period = 'month') {
  return axios.get(
    getEnvApi() + '/app-usage/?id=' + store.getters.appId + '&period=' + period,
    {
      headers: {
        Authorization: 'Bearer ' + store.getters.accessToken,
      },
    }
  )
}

const dashboardService = {
  fetchAllApps,
  fetchApp,
  fetchStats,
  fetchPeriodicUsage,
}

export default dashboardService
