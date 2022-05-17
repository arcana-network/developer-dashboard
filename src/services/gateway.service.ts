import axios, { type AxiosRequestConfig } from 'axios'

import store from '@/store'
import { ChainMapping, RegionMapping, unlimitedBytes } from '@/utils/constants'
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
    `${getEnvApi('v2')}/app/${store.getters.appId}/logo`,
    formData,
    {
      params: { type: mode, orientation },
    }
  )
}

type AppCredParams = {
  clientId: string
  clientSecret?: string
  redirectUri?: string
}

type AppParams = {
  name?: string
  region?: number
  chain?: number
  cred?: AppCredParams[]
  storage_limit?: number
  bandwidth_limit?: number
  aggregate_login?: boolean
}

function createApp(appName: string) {
  const appParams: AppParams = {
    name: appName,
    region: RegionMapping.asia,
    chain: ChainMapping.ethereum,
    cred: [],
    storage_limit: unlimitedBytes,
    bandwidth_limit: unlimitedBytes,
    aggregate_login: true,
  }
  return gatewayAuthorizedInstance.post(`${getEnvApi('v2')}/app/`, appParams)
}

function updateApp(updateAppParams: AppParams) {
  return gatewayAuthorizedInstance.patch(
    `${getEnvApi('v2')}/app?id=${store.getters.appId}`,
    updateAppParams
  )
}

export { uploadLogo, createApp, updateApp }
