import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

import store from '@/stores'
import type {
  AppId,
  Theme,
  AppConfig as AppState,
  SocialAuthState,
  Delegate,
  DelegatePermission,
  DelegateId,
  DelegateKey,
} from '@/stores/apps.store'
import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import {
  ChainMapping,
  WalletMode,
  type Network,
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

function getGatewayAuthorizedInstance(network: Network) {
  gatewayAuthorizedInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      config.headers.Authorization = `Bearer ${authStore.accessToken[network]}`
      return config
    }
  )
  return gatewayAuthorizedInstance
}

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
  config: CreateAppRequestBody,
  network: Network
): Promise<AxiosResponse<CreateAppResponse>> {
  const defaultAppConfig = {
    name: config.name,
    region: config.region,
  }
  return getGatewayAuthorizedInstance(network).post(
    `${getEnvApi('v2', network)}/app/`,
    defaultAppConfig
  )
}

function updateApp(
  appId: AppId,
  fieldsToUpdate: Partial<AppState>,
  network: Network
) {
  const app = appsStore.app(appId)
  const updatedAppConfig = { ...app, ...fieldsToUpdate }
  const appConfigRequestBody = getAppConfigRequestBody(updatedAppConfig)
  return getGatewayAuthorizedInstance(network).patch(
    `${getEnvApi('v2', network)}/app/?id=${appId}`,
    appConfigRequestBody
  )
}

function deleteCred(
  appId: AppId,
  authToRemove: SocialAuthState[],
  network: Network
) {
  const deleteCredPromises = authToRemove.map((auth) => {
    return getGatewayAuthorizedInstance(network).delete(
      `${getEnvApi('v2', network)}/cred/?id=${appId}&verifier=${auth.verifier}`
    )
  })
  return Promise.all(deleteCredPromises)
}

function getAppConfigRequestBody(app: AppState): AppConfigRequiredProps {
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
    storage_limit: 0,
    bandwidth_limit: 0,
    cred,
    aggregate_login: true,
    chain: ChainMapping[app.access.selectedChain],
    region: 1,
    theme: wallet.selectedTheme,
    wallet_domain: wallet.websiteDomain,
    wallet_type,
  }
}

function fetchAllApps(
  network: Network
): Promise<AxiosResponse<AppsListResponse[]>> {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/user-app/`
  )
}

function fetchApp(
  appId: AppId,
  network: Network
): Promise<AxiosResponse<AppConfig>> {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi('v2', network)}/app/?id=${appId}`
  )
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

function fetchStats(
  appId: AppId,
  network: Network
): Promise<AxiosResponse<StatsResponse>> {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/overview/?id=${appId}`
  )
}

function fetchPeriodicUsage(
  appId: AppId,
  period: Duration = 'month',
  network: Network
) {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/app-usage/?id=${appId}&period=${period}`
  )
}

function deleteApp(appId: AppId, network: Network) {
  return getGatewayAuthorizedInstance(network).delete(
    `${getEnvApi('v2', 'mainnet')}/app/?id=${appId}`
  )
}

async function fetchAndStoreConfig() {
  const config = (
    await axios.get(`${getEnvApi(undefined, 'mainnet')}/get-config/`)
  ).data
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
  return getGatewayAuthorizedInstance('mainnet').get(
    `${getEnvApi(undefined, 'mainnet')}/profile/`
  )
}

type OrganizationOptions = {
  name: string
  country: string
  size: number
}

function updateOrganization({ name, country, size }: OrganizationOptions) {
  return getGatewayAuthorizedInstance('mainnet').patch(
    `${getEnvApi('v2', 'mainnet')}/organization/`,
    {
      name,
      country,
      size,
    }
  )
}

function fetchAllUsers(
  appId: AppId,
  offset: number,
  count: number,
  network: Network
) {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(
      undefined,
      network
    )}/user-details/?id=${appId}&offset=${offset}&count=${count}`
  )
}

function searchUsers(appId: AppId, address: string, network: Network) {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(
      undefined,
      network
    )}/user-transactions/?id=${appId}&address=${address}`
  )
}

function fetchAllUserTransactions(
  appId: AppId,
  address: string,
  network: Network
) {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(
      undefined,
      network
    )}/user-transactions/?id=${appId}&address=${address}`
  )
}

function fetchMonthlyUsers(appId: AppId, network: Network) {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/no-of-users/?id=${appId}`
  )
}

function fetchDau(appAddress: string, network: Network) {
  const api = `/get-dau/?app=${appAddress}`
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/${api}`
  )
}

function fetchMau(appAddress: string, network: Network) {
  const api = `/get-mau/?app=${appAddress}`
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/${api}`
  )
}

function getNonce(address: string, network: Network) {
  return axios.get(
    `${getEnvApi(undefined, network)}/get-nonce/?address=${address}`
  )
}

function loginUser(
  {
    signature,
    email,
    address,
  }: {
    signature: string
    email: string
    address: string
  },
  network: Network
) {
  return axios.post(`${getEnvApi(undefined, network)}/login/`, {
    signature,
    email,
    address,
  })
}

function getThemeLogo(
  appId: AppId,
  mode: 'dark' | 'light',
  orientation: 'horizontal' | 'vertical',
  network: Network
) {
  const logoFetchUrl = `${getEnvApi('v2', network)}/app/${appId}/logo`
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
  return getGatewayAuthorizedInstance(appsStore.appNetwork).put(
    `${getEnvApi('v2', appsStore.appNetwork)}/app/${appId}/logo`,
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
  return getGatewayAuthorizedInstance(appsStore.appNetwork).delete(
    `${getEnvApi('v2', appsStore.appNetwork)}/app/${appId}/logo`,
    {
      params: { type: mode, orientation },
    }
  )
}

type DelegateResponse = Omit<Delegate, 'createdDate'> & { created_at: string }

async function fetchAppDelegates(
  appId: AppId,
  network: Network
): Promise<AxiosResponse<DelegateResponse[] | null>> {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/delegates/?app_id=${appId}`
  )
}

type CreateDelegateRequest = {
  name: string
  address: string
  permissions: DelegatePermission[]
}

type CreateDelegateResponse = Delegate & {
  err?: string
  CreatedAt: string
  ID: DelegateId
}

async function createDelegate(
  appId: AppId,
  data: CreateDelegateRequest,
  network: Network
): Promise<AxiosResponse<CreateDelegateResponse>> {
  return getGatewayAuthorizedInstance(network).post(
    `${getEnvApi(undefined, network)}/delegates/`,
    {
      appId,
      ...data,
    }
  )
}

function listDelegateKeys(
  appAddress: string,
  network: Network
): Promise<AxiosResponse<DelegateKey[]>> {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/keys/?app=${appAddress}`
  )
}

function editDelegate(
  appId: AppId,
  data: CreateDelegateRequest,
  network: Network
): Promise<AxiosResponse<CreateDelegateResponse>> {
  return getGatewayAuthorizedInstance(network).patch(
    `${getEnvApi(undefined, network)}/delegates/`,
    {
      appId,
      ...data,
    }
  )
}

function deleteDelegate(
  delegateId: DelegateId,
  network: Network
): Promise<AxiosResponse<any>> {
  return getGatewayAuthorizedInstance(network).delete(
    `${getEnvApi(undefined, network)}/delegates/?id=${delegateId}`
  )
}

type AccountStatus = 'active' | 'overlimit' | 'overdue'

function getAuthOverview(network: Network): Promise<AxiosResponse<any>> {
  return getGatewayAuthorizedInstance(network).get(
    `${getEnvApi(undefined, network)}/auth-overview/`
  )
}

function getAccountStatus(): Promise<AxiosResponse<AccountStatus>> {
  // Mocking the account details for now
  const localStatus = localStorage.getItem('account-status')?.toLowerCase()
  if (localStatus === 'overdue' || localStatus === 'overlimit') {
    return Promise.resolve({
      status: 200,
      statusText: 'Success',
      headers: {},
      config: {},
      data: localStatus,
    })
  } else {
    return Promise.resolve({
      status: 200,
      statusText: 'Success',
      headers: {},
      config: {},
      data: 'active',
    })
  }
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
  getAccountStatus,
  fetchDau,
  fetchMau,
  getAuthOverview,
  type AppConfig,
  type AppConfigCred,
  type AppConfigThemeLogo,
  type Duration,
  type AppConfigRequiredProps,
  type AccountStatus,
}
