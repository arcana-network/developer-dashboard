import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import bytes from 'bytes'

import store from '@/stores'
import type {
  AppId,
  Theme,
  AppConfig as AppState,
  SocialAuthState,
  Delegate,
  DelegatePermission,
  DelegateId,
} from '@/stores/apps.store'
import { useAppsStore } from '@/stores/apps.store'
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
const appsStore = useAppsStore(store)

let forwarder: string, rpcUrl: string

type Duration = 'month' | 'day' | 'year' | 'quarter'

type AppConfigCred = {
  verifier: SocialAuthVerifier
  clientId?: string
  clientSecret?: string
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

type AppConfigRequiredProps = Omit<AppConfig, 'ID' | 'logo'>

type AppsListResponse = {
  id: AppId
  name: string
  no_of_files: number
  total_users: number
  storage: number
  bandwidth: number
  consumed_storage: number
  consumed_bandwidth: number
  estimated_cost: number
  created_at: string
}

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

function updateApp(appId: AppId, fieldsToUpdate: Partial<AppState>) {
  const app = appsStore.app(appId)
  const updatedAppConfig = { ...app, ...fieldsToUpdate }
  const appConfigRequestBody = getAppConfigRequestBody(updatedAppConfig)
  return gatewayAuthorizedInstance.patch(
    `${getEnvApi('v2')}/app/?id=${appId}`,
    appConfigRequestBody
  )
}

function deleteCred(appId: AppId, authToRemove: SocialAuthState[]) {
  const deleteCredPromises = authToRemove.map((auth) => {
    return gatewayAuthorizedInstance.delete(
      `${getEnvApi('v2')}/cred/?id=${appId}&verifier=${auth.verifier}`
    )
  })
  return Promise.all(deleteCredPromises)
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

  const { social, wallet } = app.auth
  const cred: AppConfigCred[] = social.map((authType) => {
    return {
      verifier: authType.verifier,
      clientId: authType.clientId,
      clientSecret: authType.clientSecret,
    }
  })

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

function fetchAllApps(): Promise<AxiosResponse<AppsListResponse[]>> {
  return gatewayAuthorizedInstance.get(`${getEnvApi()}/user-app/`)
}

function fetchApp(appId: AppId): Promise<AxiosResponse<AppConfig>> {
  return gatewayAuthorizedInstance.get(`${getEnvApi('v2')}/app/?id=${appId}`)
}

type StatsResponse = {
  actions: {
    upload: number
    download: number
    share: number
    revoke: number
    ownership_change: number
    delete: number
    storage: number
    bandwidth: number
  }
  no_of_users: number
  consumed_storage: number
  storage: number
  consumed_bandwidth: number
  bandwidth: number
}

function fetchStats(appId: AppId): Promise<AxiosResponse<StatsResponse>> {
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

type DelegateResponse = Omit<Delegate, 'createdDate'> & { created_at: string }

async function fetchAppDelegates(
  appId: AppId
): Promise<AxiosResponse<DelegateResponse[] | null>> {
  return gatewayAuthorizedInstance.get(
    `${getEnvApi()}/delegates/?app_id=${appId}`
  )
}

type CreateDelegateRequest = {
  name: string
  address: string
  permissions: DelegatePermission[]
}

async function createDelegate(
  appId: AppId,
  data: CreateDelegateRequest
): Promise<AxiosResponse<DelegateResponse>> {
  return gatewayAuthorizedInstance.post(`${getEnvApi()}/delegates/`, {
    appId,
    ...data,
  })
}

function listDelegateKeys(
  appAddress: string
): Promise<AxiosResponse<string[]>> {
  return gatewayAuthorizedInstance.get(`${getEnvApi()}/keys/?app=${appAddress}`)
}

type EditDelegateResponse = {
  message: string
}

function editDelegate(
  appId: AppId,
  data: CreateDelegateRequest
): Promise<AxiosResponse<EditDelegateResponse>> {
  return gatewayAuthorizedInstance.patch(`${getEnvApi()}/delegates/`, {
    appId,
    ...data,
  })
}

function deleteDelegate(delegateId: DelegateId): Promise<AxiosResponse<any>> {
  return gatewayAuthorizedInstance.delete(
    `${getEnvApi()}/delegates/?id=${delegateId}`
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
  deleteCred,
  fetchAppDelegates,
  createDelegate,
  listDelegateKeys,
  editDelegate,
  deleteDelegate,
  type AppConfig,
  type AppConfigCred,
  type AppConfigThemeLogo,
  type Duration,
  type AppConfigRequiredProps,
}
