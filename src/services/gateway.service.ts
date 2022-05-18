import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

import store from '@/store'
import {
  ChainMapping,
  MAX_DATA_TRANSFER_BYTES,
  RegionMapping,
} from '@/utils/constants'
import getEnvApi from '@/utils/get-env-api'

type Duration = 'month' | 'day' | 'year' | 'quarter'

type AppConfigCred = {
  verifier: string
  clientId?: string
  clientSecret?: string
  redirectURL?: string
  origin?: string
}

type AppConfigThemeLogo = {
  dark_horizontal?: string
  dark_vertical?: string
  light_horizontal?: string
  light_vertical?: string
}

type AppConfig = {
  ID?: number
  name?: string
  address?: string
  cred?: AppConfigCred[]
  aggregate_login?: boolean
  bandwidth_limit: number
  storage_limit: number
  chain: number
  region: number
  theme?: string
  wallet_type?: number
  wallet_domain?: string
  logo?: AppConfigThemeLogo
}

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
    `${getEnvApi('v2')}/app/${store.getters.appId}/logo`,
    formData,
    {
      params: { type: mode, orientation },
    }
  )
}

function createApp(appName: string): Promise<AxiosResponse<AppConfig>> {
  const defaultAppConfig: AppConfig = {
    name: appName,
    region: RegionMapping.asia,
    chain: ChainMapping.ethereum,
    cred: [],
    storage_limit: MAX_DATA_TRANSFER_BYTES,
    bandwidth_limit: MAX_DATA_TRANSFER_BYTES,
    aggregate_login: true,
    theme: 'dark',
    wallet_domain: '',
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

function fetchApp(appId?: number) {
  return gatewayAuthorizedInstance.get(`${getEnvApi('v2')}/app/?id=${appId}`)
}

function fetchStats() {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/overview/?id=${store.getters.appId}`
  )
}

function fetchPeriodicUsage(period: Duration = 'month') {
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

function getThemeLogo(
  mode: 'dark' | 'light',
  orientation: 'horizontal' | 'vertical'
) {
  const logoFetchUrl = `${getEnvApi('v2')}/app/${store.getters.appId}/logo`
  return {
    mode,
    orientation,
    url: `${logoFetchUrl}?type=${mode}&orientation=${orientation}`,
  }
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
  getThemeLogo,
  type AppConfig,
  type AppConfigCred,
  type AppConfigThemeLogo,
  type Duration,
}
