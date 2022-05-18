import axios, { type AxiosRequestConfig } from 'axios'

import store from '@/store'
import { ChainMapping, RegionMapping, unlimitedBytes } from '@/utils/constants'
import type { AppConfig } from '@/utils/fetchAndStoreAppConfig'
import getEnvApi from '@/utils/get-env-api'

const gatewayAuthorizedInstance = axios.create()
gatewayAuthorizedInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${store.getters.accessToken}`
    return config
  }
)

function uploadLogo(
  file: File,
  mode: 'dark' | 'light',
  orientation?: 'horizontal' | 'vertical'
) {
  const formData: FormData = new FormData()
  formData.append('file', file)
  return gatewayAuthorizedInstance.put(
    `${getEnvApi('v2')}/app/${store.getters.appId}/logo/`,
    formData,
    {
      params: { type: mode, orientation },
    }
  )
}

function createApp(appName: string) {
  const defaultAppConfig: AppConfig = {
    name: appName,
    region: RegionMapping.asia,
    chain: ChainMapping.ethereum,
    cred: [],
    storage_limit: unlimitedBytes,
    bandwidth_limit: unlimitedBytes,
    aggregate_login: true,
    theme: 'dark',
  }
  return gatewayAuthorizedInstance.post(
    `${getEnvApi('v2')}/app/`,
    defaultAppConfig
  )
}

function updateApp(updatedAppConfig: AppConfig) {
  return gatewayAuthorizedInstance.patch(
    `${getEnvApi('v2')}/app/?id=${store.getters.appId}`,
    updatedAppConfig
  )
}

function fetchAllApps() {
  return gatewayAuthorizedInstance.get(`${getEnvApi()}/user-app/`)
}

function fetchApp(appId: number) {
  return gatewayAuthorizedInstance.get(`${getEnvApi('v2')}/app/?id=${appId}`)
}

function fetchStats() {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/overview/?id=${store.getters.appId}`
  )
}

function fetchPeriodicUsage(
  period: 'month' | 'day' | 'year' | 'quarter' = 'month'
) {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/app-usage/?id=${store.getters.appId}&period=${period}`
  )
}

function deleteApp() {
  return gatewayAuthorizedInstance.delete(
    `${getEnvApi('v2')}/app/?id=${store.getters.appId}`
  )
}

function getConfig() {
  return axios.get(`${getEnvApi()}/get-config/`)
}

function fetchProfile() {
  return gatewayAuthorizedInstance.get(`${getEnvApi()}/profile/`)
}

type OrganizationOptions = {
  name: string
  country: string
  size: number
}

function updateOrganization({ name, country, size }: OrganizationOptions) {
  return gatewayAuthorizedInstance.post(`${getEnvApi('v2')}/organization/`, {
    name,
    country,
    size,
  })
}

function fetchAllUsers() {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/user-details/?id=${store.getters.appId}`
  )
}

function searchUsers(address: string) {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/user-transactions/?id=${
      store.getters.appId
    }&address=${address}`
  )
}

function fetchAllUserTransactions(address: string) {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/user-transactions/?id=${
      store.getters.appId
    }&address=${address}`
  )
}

function fetchMonthlyUsers() {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/no-of-users/?id=${store.getters.appId}`
  )
}

function getNonce(address: string) {
  return axios.get(`${getEnvApi()}/get-nonce/?address=${address}`)
}

function loginUser({
  signature,
  email,
  address,
}: {
  signature: string
  email: string
  address: string
}) {
  return axios.post(`${getEnvApi()}/login/`, {
    signature,
    email,
    address,
  })
}

export {
  uploadLogo,
  createApp,
  updateApp,
  deleteApp,
  fetchApp,
  fetchAllApps,
  fetchStats,
  fetchPeriodicUsage,
  getConfig,
  fetchProfile,
  updateOrganization,
  fetchAllUsers,
  searchUsers,
  fetchAllUserTransactions,
  fetchMonthlyUsers,
  loginUser,
  getNonce,
}
