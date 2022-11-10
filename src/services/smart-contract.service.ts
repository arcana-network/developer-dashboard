import type { AppConfigCred } from '@/services/gateway.service'
import store from '@/stores'
import { useAppsStore, type AppId } from '@/stores/apps.store'
import {
  signTransaction,
  hashJson,
  delegator,
  getTransactionRequestProps,
} from '@/utils/signerUtils'

const appsStore = useAppsStore(store)

async function setDefaultLimit(storage: number, bandwidth: number) {
  await signTransaction('setDefaultLimit', [storage, bandwidth])
}

async function setAppConfig(appName: string, socialAuth: AppConfigCred[]) {
  const clientIds = socialAuth
    .filter((authInfo) => authInfo.verifier && authInfo.clientId)
    .reduce((previousValue, authInfo) => {
      return { ...previousValue, [authInfo.verifier]: authInfo.clientId }
    }, {})
  const appConfig = hashJson({ appName, clientIds })
  await signTransaction('setAppConfig', [appConfig])
}

async function revokeDelegate(appId: AppId, keyAddress: string) {
  const { appAddress, gateway, forwarderAddress, accessToken } =
    getTransactionRequestProps(appsStore.app(appId).address)
  const provider = window.arcana.provider
  await delegator.revoke({
    provider,
    appAddress,
    forwarderAddress,
    gateway,
    accessToken,
    delegator: keyAddress,
  })
}

export { setAppConfig, setDefaultLimit, revokeDelegate }
