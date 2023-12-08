import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

import store from '@/stores'
import type {
  AppId,
  Theme,
  AppConfig as AppState,
  SocialAuthState,
} from '@/stores/apps.store'
import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import {
  ChainMapping,
  WalletMode,
  type Network,
  type SocialAuthVerifier,
  api,
  type WalletUIMode,
} from '@/utils/constants'
import getEnvApi from '@/utils/get-env-api'

const authStore = useAuthStore(store)
const appsStore = useAppsStore(store)
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK
const ApiNetwork = ARCANA_AUTH_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'

let forwarder: string, rpcUrl: string
let testnetForwarder: string, testnetRpcUrl: string

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
  global_id: number
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
  status: 0 | 1 | 2 | 3
  global: boolean
  wallet_mode: WalletUIMode
  chain_type: string
}

const gatewayInstance = {
  mainnet: axios.create({ baseURL: api.gateway.mainnet }),
  testnet: axios.create({ baseURL: api.gateway.testnet }),
}

function getGatewayInstance(network: Network) {
  gatewayInstance[network].interceptors.request.use(
    (config: AxiosRequestConfig) => {
      config.headers.Authorization = `Bearer ${authStore.accessToken[network]}`
      return config
    }
  )

  return gatewayInstance[network]
}

type CreateAppRequestBody = {
  name: string
  region: number
  chain: number
  default_chain: number
  chains?: any[]
  wallet_mode: WalletUIMode
  chain_type: string
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
  global_id: number
  storage: number
  bandwidth: number
  consumed_storage: number
  consumed_bandwidth: number
  estimated_cost: number
  created_at: string
  mau: number
}

function createApp(
  config: CreateAppRequestBody,
  network: Network
): Promise<AxiosResponse<CreateAppResponse>> {
  const defaultAppConfig = {
    name: config.name,
    region: config.region,
    chain: config.chain,
    chain_type: config.chain_type,
    default_chain: config.default_chain,
    chains: config.chains,
    wallet_mode: config.wallet_mode,
  }
  return getGatewayInstance(network).post(
    `${getEnvApi('v2')}/app/`,
    defaultAppConfig
  )
}

function updateApp(
  appId: AppId,
  fieldsToUpdate: Partial<AppState>,
  network: Network
) {
  const app =
    network === 'mainnet'
      ? (appsStore.getMainnetApp(appId) as AppState)
      : appsStore.app(appId)
  if (app) {
    const updatedAppConfig = { ...app, ...fieldsToUpdate }
    const appConfigRequestBody = getAppConfigRequestBody(updatedAppConfig)
    return getGatewayInstance(network).patch(
      `${getEnvApi('v2')}/app/?id=${appId}`,
      appConfigRequestBody
    )
  }
}

function updateAppLogos(
  appId: AppId,
  logos: AppConfigThemeLogo,
  network: Network
) {
  const app = appsStore.app(appId)
  const updatedAppConfig = { ...app }
  const appConfigRequestBody = getAppConfigRequestBody(updatedAppConfig)
  appConfigRequestBody.logo = logos
  return getGatewayInstance(network).patch(
    `${getEnvApi('v2')}/app/?id=${appId}`,
    appConfigRequestBody
  )
}

function deleteCred(
  appId: AppId,
  authToRemove: SocialAuthState[],
  network: Network
) {
  const deleteCredPromises = authToRemove.map((auth) => {
    return getGatewayInstance(network).delete(
      `${getEnvApi('v2')}/cred/?id=${appId}&verifier=${auth.verifier}`
    )
  })
  return Promise.all(deleteCredPromises)
}

function getAppConfigRequestBody(app: AppState): AppConfigRequiredProps {
  const { social, wallet } = app.auth
  const cred: AppConfigCred[] = social.map((authType) => {
    if (authType.verifier === 'aws') {
      return {
        verifier: authType.verifier,
        domain: authType.clientSecret,
        clientId: authType.clientId,
      }
    }
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
    global_id: app.global_id,
    storage_limit: 0,
    bandwidth_limit: 0,
    cred,
    aggregate_login: true,
    chain: ChainMapping[app.access.selectedChain],
    region: 1,
    theme: wallet.selectedTheme,
    wallet_domain: wallet.websiteDomain,
    wallet_type,
    global: app.keyspace === 'global',
    status: app.status,
    wallet_mode: app.wallet_mode,
  }
}

function fetchAllApps(
  network: Network
): Promise<AxiosResponse<AppsListResponse[]>> {
  return getGatewayInstance(network).get(`${getEnvApi()}/user-app/`)
}

function fetchApp(
  appId: AppId,
  network: Network
): Promise<AxiosResponse<AppConfig>> {
  return getGatewayInstance(network).get(`${getEnvApi('v2')}/app/?id=${appId}`)
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
  return getGatewayInstance(network).get(`${getEnvApi()}/overview/?id=${appId}`)
}

function fetchPeriodicUsage(
  appId: AppId,
  period: Duration = 'month',
  network: Network
) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/app-usage/?id=${appId}&period=${period}`
  )
}

function deleteApp(appId: AppId, network: Network) {
  return getGatewayInstance(network).delete(
    `${getEnvApi('v2')}/app/?id=${appId}`
  )
}

async function fetchAndStoreConfig() {
  const config = (
    await gatewayInstance.mainnet.get(`${getEnvApi()}/get-config/`)
  ).data
  const testnetConfig = (
    await gatewayInstance.testnet.get(`${getEnvApi()}/get-config/`)
  ).data
  forwarder = config?.Forwarder
  rpcUrl = config?.RPC_URL
  testnetForwarder = testnetConfig?.Forwarder
  testnetRpcUrl = testnetConfig?.RPC_URL
}

function getConfig(network: Network = 'mainnet') {
  if (network === 'testnet') {
    return {
      forwarder: testnetForwarder,
      rpcUrl: testnetRpcUrl,
    }
  }
  return {
    forwarder,
    rpcUrl,
  }
}

function fetchProfile() {
  return getGatewayInstance('mainnet').get(`${getEnvApi()}/profile/`)
}

type OrganizationOptions = {
  name: string
  country: string
  size: number
}

function updateOrganization({ name, country, size }: OrganizationOptions) {
  return getGatewayInstance('mainnet').patch(
    `${getEnvApi('v2')}/organization/`,
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
  return getGatewayInstance(network).get(
    `${getEnvApi()}/user-details/?id=${appId}&offset=${offset}&count=${count}`
  )
}

function searchUsers(appId: AppId, address: string, network: Network) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/user-transactions/?id=${appId}&address=${address}`
  )
}

function fetchAllUserTransactions(
  appId: AppId,
  address: string,
  network: Network
) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/user-transactions/?id=${appId}&address=${address}`
  )
}

function fetchMonthlyUsers(appId: AppId, network: Network) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/no-of-users/?id=${appId}`
  )
}

type ActiveUsersChartData = {
  Date: string
  Value: number
}

function fetchDau(
  appAddress: string,
  network: Network
): Promise<AxiosResponse<ActiveUsersChartData[]>> {
  const api = `get-dau/?app=${appAddress}`
  return getGatewayInstance(network).get(`${getEnvApi()}/${api}`)
}

function fetchMau(
  appAddress: string,
  network: Network
): Promise<AxiosResponse<ActiveUsersChartData[]>> {
  const api = `/get-mau/?app=${appAddress}`
  return getGatewayInstance(network).get(`${getEnvApi()}/${api}`)
}

function getNonce(address: string) {
  const URL = api.gateway.mainnet
  return axios.get(`${URL}${getEnvApi()}/get-nonce/`, {
    params: { address },
  })
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
  const instance = getGatewayInstance(network)
  return instance.post(`${getEnvApi()}/login/`, {
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
  const url = `${api.gateway[network]}${getEnvApi('v2')}/app/${appId}/logo`
  return {
    mode,
    orientation,
    url: `${url}?type=${mode}&orientation=${orientation}`,
  }
}

function uploadThemeLogo(
  appId: AppId,
  file: File,
  mode: 'dark' | 'light',
  network: Network,
  orientation?: 'horizontal' | 'vertical'
) {
  const formData: FormData = new FormData()
  formData.append('file', file)
  return getGatewayInstance(network).put(
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
  network: Network,
  orientation?: 'horizontal' | 'vertical'
) {
  return getGatewayInstance(network).delete(
    `${getEnvApi('v2')}/app/${appId}/logo`,
    {
      params: { type: mode, orientation },
    }
  )
}

type AccountStatus = 'active' | 'overlimit' | 'overdue'

function getAuthOverview(network: Network): Promise<AxiosResponse<any>> {
  return getGatewayInstance(network).get(`${getEnvApi()}/auth-overview/`)
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

function submitVerificationForm(
  network: Network,
  formData: any
): Promise<AxiosResponse<any>> {
  return getGatewayInstance(network).post(`${getEnvApi()}/verify-app/`, {
    ...formData,
  })
}

function updateBillingAddress(address: any): Promise<AxiosResponse<any>> {
  return getGatewayInstance(ApiNetwork).post(
    `${getEnvApi()}/billing-address/`,
    address
  )
}

function getBillingAddress(): Promise<AxiosResponse<any>> {
  return getGatewayInstance(ApiNetwork).get(`${getEnvApi()}/billing-address/`)
}

function addCard(token: string): Promise<AxiosResponse<any>> {
  return getGatewayInstance(ApiNetwork).post(`${getEnvApi()}/card/`, {
    token,
  })
}

function listCards(): Promise<AxiosResponse<any>> {
  return getGatewayInstance(ApiNetwork).get(`${getEnvApi()}/card/`)
}

function deleteCard(card_id: string): Promise<AxiosResponse<any>> {
  return getGatewayInstance(ApiNetwork).delete(`${getEnvApi()}/card/`, {
    data: {
      card_id,
    },
  })
}

function listInvoices(network: Network): Promise<AxiosResponse<any>> {
  return getGatewayInstance(network).get(`${getEnvApi()}/invoices/`)
}

function getNotifications() {
  return getGatewayInstance(ApiNetwork).get(`${getEnvApi()}/notification/`)
}

function updateNotificationRead(list: number[]) {
  const body = { notifications: list }
  return getGatewayInstance(ApiNetwork).post(
    `${getEnvApi()}/notification/read/`,
    body
  )
}

function getChains(appId: number, network: Network) {
  return getGatewayInstance(network).get(`${getEnvApi()}/chain/${appId}/all/`)
}

function getAllChains(network: Network) {
  return getGatewayInstance(network).get(`${getEnvApi()}/chain/0/all/`)
}

function getChainLogo(chainId: number, network: Network) {
  return `${api.gateway[network]}${getEnvApi()}/chain/logo/${chainId}/`
}

function addChain(appId: number, data: any, network: Network) {
  if (network === 'mainnet') {
    return getGatewayInstance(network).post(
      `${getEnvApi()}/chain/${appId}/`,
      data
    )
  } else {
    return getGatewayInstance(network).post(
      `${getEnvApi()}/chain/${appId}/${data.chain_id}`,
      data
    )
  }
}

function editChain(appId: number, data: any, network: Network) {
  if (network === 'mainnet') {
    return getGatewayInstance(network).patch(
      `${getEnvApi()}/chain/${appId}/`,
      data
    )
  } else {
    return getGatewayInstance(network).patch(
      `${getEnvApi()}/chain/${appId}/${data.id}`,
      data
    )
  }
}

function deleteChain(appId: number, data: any, network: Network) {
  if (network === 'mainnet') {
    return getGatewayInstance(network).delete(
      `${getEnvApi()}/chain/${appId}/`,
      {
        data,
      }
    )
  } else {
    return getGatewayInstance(network).delete(
      `${getEnvApi()}/chain/${appId}/${data.id}`,
      {
        data,
      }
    )
  }
}

function setDefaultChain(appId: number, data: any, network: Network) {
  if (network === 'mainnet') {
    return getGatewayInstance(network).post(
      `${getEnvApi()}/chain/${appId}/default/`,
      data
    )
  } else {
    return getGatewayInstance(network).post(
      `${getEnvApi()}/chain/${appId}/default/${data.id}`,
      data
    )
  }
}

async function getChainIDUsingRPCUrl(rpcURL: string) {
  const payload = { jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 } // id - dummy value
  return axios.post(rpcURL, payload)
}

async function getGaslessSupportChains(network: Network) {
  return getGatewayInstance(network).get(`${getEnvApi()}/gasless-networks/`)
}

async function getGastanks(appId: string, network: Network) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/gastank/?app_id=${appId}`
  )
}

async function addGastank(data: object, network: Network) {
  return getGatewayInstance(network).post(`${getEnvApi()}/gastank/`, data)
}

async function getPaymaster(tankId: number, network: Network) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/gastank/paymaster/?gastank_id=${tankId}`
  )
}

async function changeGastankStatus(
  tankId: number,
  status: boolean,
  network: Network
) {
  return getGatewayInstance(network).post(`${getEnvApi()}/gastank/status/`, {
    active: status,
    gastank_id: tankId,
  })
}

async function getFundingMessage(network: Network, appId: string) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/gastank/funding-message/?app_id=${appId}`
  )
}

async function updateSignature(
  owner: string,
  gastankId: number,
  signature: string,
  network: Network
) {
  const data = {
    address: owner,
    gastank_id: gastankId,
    signature,
    type: 'paymasterFundingId',
  }
  return getGatewayInstance(network).patch(
    `${getEnvApi()}/gastank/submit-signature/`,
    data
  )
}

async function getAbi(
  chainId: number,
  contractAddress: string,
  network: Network
) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/get-abi/?chain_id=${chainId}&contract_address=${contractAddress}`
  )
}

async function createSmartContract(payload: object, network: Network) {
  return getGatewayInstance(network).post(
    `${getEnvApi()}/gastank/smart-contract/`,
    payload
  )
}

async function editSmartContract(payload: object, network: Network) {
  return getGatewayInstance(network).patch(
    `${getEnvApi()}/gastank/smart-contract/`,
    payload
  )
}

async function getSmartContracts(tankId: number, network: Network) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/gastank/smart-contract/?gas_tank_id=${tankId}`
  )
}

async function getSmartContractMethods(
  smartContractId: number,
  network: Network
) {
  return getGatewayInstance(network).get(
    `${getEnvApi()}/gastank/smart-contract/${smartContractId}/`
  )
}

async function deleteSmartContract(smartContractId: number, network: Network) {
  return getGatewayInstance(network).delete(
    `${getEnvApi()}/gastank/smart-contract/?smart_contract_id=${smartContractId}`
  )
}

async function updateSelectedChainType(
  appId: string | number,
  network: Network,
  chainType: string
) {
  return getGatewayInstance(network).post(
    `${getEnvApi()}/update-chain-type/?app_id=${appId}&chain_type=${chainType}`
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
  getAccountStatus,
  fetchDau,
  fetchMau,
  getAuthOverview,
  getGatewayInstance,
  updateAppLogos,
  submitVerificationForm,
  addCard,
  listCards,
  deleteCard,
  listInvoices,
  getNotifications,
  updateNotificationRead,
  updateBillingAddress,
  getBillingAddress,
  getChains,
  addChain,
  deleteChain,
  editChain,
  setDefaultChain,
  getAllChains,
  getChainIDUsingRPCUrl,
  getChainLogo,
  getGaslessSupportChains,
  addGastank,
  getGastanks,
  getPaymaster,
  getFundingMessage,
  updateSignature,
  getAbi,
  createSmartContract,
  getSmartContracts,
  deleteSmartContract,
  getSmartContractMethods,
  editSmartContract,
  changeGastankStatus,
  updateSelectedChainType,
  type AppConfig,
  type AppConfigCred,
  type AppConfigThemeLogo,
  type Duration,
  type AppConfigRequiredProps,
  type AccountStatus,
  type CreateAppResponse,
  type ActiveUsersChartData,
}
