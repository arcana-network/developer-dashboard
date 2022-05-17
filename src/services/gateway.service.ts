import axios, { type AxiosRequestConfig } from 'axios'

import store from '@/store'
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

function createApp(appName: string) {
  return gatewayAuthorizedInstance.post(`${getEnvApi('v2')}/app/`, { appName })
}

export { uploadLogo, createApp }
