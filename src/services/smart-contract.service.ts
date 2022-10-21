import type { AppConfigCred } from '@/services/gateway.service'
import type { DelegateId, DelegatePermission } from '@/stores/apps.store'
import { signTransaction, hashJson } from '@/utils/signerUtils'

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

async function enableUiMode() {
  await signTransaction('setUiMode')
}

async function setDelegate(
  keyAddress: string,
  delegateId: DelegateId,
  permissions: DelegatePermission[]
) {
  // await signTransaction('setDelegate', [keyAddress, delegateId, ...permissions])
  return
}

async function unsetDelegate(
  keyAddress: string,
  delegateId: DelegateId,
  permissions: DelegatePermission[]
) {
  // await signTransaction('unsetDelegate', [
  //   keyAddress,
  //   delegateId,
  //   ...permissions,
  // ])
  return
}

export {
  setAppConfig,
  setDefaultLimit,
  enableUiMode,
  setDelegate,
  unsetDelegate,
}
