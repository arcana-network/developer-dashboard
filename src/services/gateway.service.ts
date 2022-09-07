import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import bytes from 'bytes'

import store from '@/stores'
import type { AppId, Theme, AppConfig as AppState } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import {
  ChainMapping,
  MAX_DATA_TRANSFER_BYTES,
  RegionMapping,
  WalletMode,
  type SocialAuthVerifier,
} from '@/utils/constants'
import getEnvApi from '@/utils/get-env-api'

const authStore = useAuthStore(store)

let forwarder: string, rpcUrl: string

type Duration = 'month' | 'day' | 'year' | 'quarter'

type AppConfigCred = {
  verifier: SocialAuthVerifier | 'passwordless'
  clientId?: string
  clientSecret?: string
  redirectURL?: string
  redirectUrl?: string
  origin?: string
}

type AppConfigThemeLogo = {
  dark_horizontal?: string
  dark_vertical?: string
  light_horizontal?: string
  light_vertical?: string
}

type AppConfig = {
  ID: AppId
  name: string
  address: string
  cred: AppConfigCred[]
  aggregate_login: boolean
  bandwidth_limit: number
  storage_limit: number
  chain: number
  region: number
  theme: Theme
  wallet_type: WalletMode.NoUI | WalletMode.UI
  wallet_domain?: string
  logo: AppConfigThemeLogo
}

const gatewayAuthorizedInstance = axios.create()
gatewayAuthorizedInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
    return config
  }
)

type CreateAppRequestBody = {
  name: string
  region: number
}

type CreateAppResponse = {
  app: AppConfig
  txHash: string
}

type Cred = {
  verifier: SocialAuthVerifier | 'passwordless'
  clientId?: string
  clientSecret?: string
  redirectURL?: string
  origin?: string
}

type AppConfigRequiredProps = Omit<AppConfig, 'ID' | 'logo'>

function createApp(
  config: CreateAppRequestBody
): Promise<AxiosResponse<CreateAppResponse>> {
  const defaultAppConfig = {
    name: config.name,
    region: config.region,
  }
  return gatewayAuthorizedInstance.post(
    `${getEnvApi('v2')}/app/`,
    defaultAppConfig
  )
}

function updateApp(appId: AppId, updatedAppConfig: AppState) {
  const appConfigRequestBody = getAppConfigRequestBody(updatedAppConfig)
  return gatewayAuthorizedInstance.patch(
    `${getEnvApi('v2')}/app/?id=${appId}`,
    appConfigRequestBody
  )
}

function getAppConfigRequestBody(app: AppState): AppConfigRequiredProps {
  let storage_limit: number, bandwidth_limit: number
  const storageLimit = app.store.userLimits.storage
  const bandwidthLimit = app.store.userLimits.bandwidth
  if (storageLimit.isUnlimited) {
    storage_limit = MAX_DATA_TRANSFER_BYTES
  } else {
    storage_limit = bytes(`${storageLimit.value} ${storageLimit.unit}`)
  }

  if (bandwidthLimit.isUnlimited) {
    bandwidth_limit = MAX_DATA_TRANSFER_BYTES
  } else {
    bandwidth_limit = bytes(`${bandwidthLimit.value} ${bandwidthLimit.unit}`)
  }

  const { social, passwordless, wallet } = app.auth
  const cred: Cred[] = social.map((authType) => {
    return {
      verifier: authType.verifier,
      clientId: authType.clientId,
      clientSecret: authType.clientSecret,
      redirectURL: authType.redirectUri,
    }
  })

  const { javascriptOrigin, redirectUri } = passwordless
  if (javascriptOrigin && redirectUri) {
    cred.push({
      verifier: 'passwordless',
      origin: javascriptOrigin,
      redirectURL: redirectUri,
    })
  }

  const wallet_type = wallet.walletType

  return {
    name: app.name,
    address: app.address,
    storage_limit,
    bandwidth_limit,
    cred,
    aggregate_login: true,
    chain: ChainMapping[app.access.selectedChain],
    region: RegionMapping[app.store.region],
    theme: wallet.selectedTheme,
    wallet_domain: wallet.websiteDomain,
    wallet_type,
  }
}

function fetchAllApps(): Promise<
  AxiosResponse<(AppConfig & { CreatedAt: string })[]>
> {
  return gatewayAuthorizedInstance.get(`${getEnvApi()}/user-app/`)
}

function fetchApp(appId: AppId): Promise<AxiosResponse<AppConfig>> {
  return gatewayAuthorizedInstance.get(`${getEnvApi('v2')}/app/?id=${appId}`)
}

function fetchStats(appId: AppId) {
  return gatewayAuthorizedInstance.get(`${getEnvApi()}/overview/?id=${appId}`)
}

function fetchPeriodicUsage(appId: AppId, period: Duration = 'month') {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/app-usage/?id=${appId}&period=${period}`
  )
}

function deleteApp(appId: AppId) {
  return gatewayAuthorizedInstance.delete(`${getEnvApi('v2')}/app/?id=${appId}`)
}

async function fetchAndStoreConfig() {
  const config = (await axios.get(`${getEnvApi()}/get-config/`)).data
  forwarder = config?.Forwarder
  rpcUrl = config?.RPC_URL
}

function getConfig() {
  return {
    forwarder,
    rpcUrl,
  }
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
  return gatewayAuthorizedInstance.patch(`${getEnvApi('v2')}/organization/`, {
    name,
    country,
    size,
  })
}

function fetchAllUsers(appId: AppId) {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/user-details/?id=${appId}`
  )
}

function searchUsers(appId: AppId, address: string) {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/user-transactions/?id=${appId}&address=${address}`
  )
}

function fetchAllUserTransactions(appId: AppId, address: string) {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/user-transactions/?id=${appId}&address=${address}`
  )
}

function fetchMonthlyUsers(appId: AppId) {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/no-of-users/?id=${appId}`
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
  appId: AppId,
  mode: 'dark' | 'light',
  orientation: 'horizontal' | 'vertical'
) {
  const logoFetchUrl = `${getEnvApi('v2')}/app/${appId}/logo`
  return {
    mode,
    orientation,
    url: `${logoFetchUrl}?type=${mode}&orientation=${orientation}`,
  }
}

function uploadThemeLogo(
  appId: AppId,
  file: File,
  mode: 'dark' | 'light',
  orientation?: 'horizontal' | 'vertical'
) {
  const formData: FormData = new FormData()
  formData.append('file', file)
  return gatewayAuthorizedInstance.put(
    `${getEnvApi('v2')}/app/${appId}/logo`,
    formData,
    {
      params: { type: mode, orientation },
    }
  )
}

function removeThemeLogo(
  appId: AppId,
  mode: 'dark' | 'light',
  orientation?: 'horizontal' | 'vertical'
) {
  return gatewayAuthorizedInstance.delete(
    `${getEnvApi('v2')}/app/${appId}/logo`,
    {
      params: { type: mode, orientation },
    }
  )
}

export {
  getAppConfigRequestBody,
  createApp,
  updateApp,
  deleteApp,
  fetchApp,
  fetchAllApps,
  fetchStats,
  fetchPeriodicUsage,
  getConfig,
  fetchAndStoreConfig,
  fetchProfile,
  updateOrganization,
  fetchAllUsers,
  searchUsers,
  fetchAllUserTransactions,
  fetchMonthlyUsers,
  loginUser,
  getNonce,
  getThemeLogo,
  uploadThemeLogo,
  removeThemeLogo,
  type AppConfig,
  type AppConfigCred,
  type AppConfigThemeLogo,
  type Duration,
  type AppConfigRequiredProps,
}
