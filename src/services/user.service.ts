import axios from 'axios'

import store from '@/store'
import getEnvApi from '@/utils/get-env-api'

function fetchAllUsers() {
  return axios.get(getEnvApi() + '/user-details/?id=' + store.getters.appId, {
    headers: {
      Authorization: 'Bearer ' + store.getters.accessToken,
    },
  })
}

function searchUsers(address) {
  return axios.get(
    getEnvApi() +
      '/user-transactions/?id=' +
      store.getters.appId +
      '&address=' +
      address,
    {
      headers: {
        Authorization: 'Bearer ' + store.getters.accessToken,
      },
    }
  )
}

function fetchAllUserTransactions(userAddress) {
  return axios.get(
    getEnvApi() +
      '/user-transactions/?id=' +
      store.getters.appId +
      '&address=' +
      userAddress,
    {
      headers: {
        Authorization: 'Bearer ' + store.getters.accessToken,
      },
    }
  )
}

function fetchMonthlyUsers() {
  return axios.get(getEnvApi() + '/no-of-users/?id=' + store.getters.appId, {
    headers: {
      Authorization: 'Bearer ' + store.getters.accessToken,
    },
  })
}

const userService = {
  fetchAllUsers,
  searchUsers,
  fetchAllUserTransactions,
  fetchMonthlyUsers,
}

export default userService
