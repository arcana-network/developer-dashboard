import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { useUrlStore } from '@/stores/url.store'
import getEnvApi from '@/utils/get-env-api'

const urlStore = useUrlStore()
const authStore = useAuthStore()
const appStore = useAppStore()

type SmartContractRequestParams = {
  privateKey: string
  appAddress: string
  rpc: string
  gateway: string
  forwarderAddress: string
  accessToken: string
  method?: string
  value?: string
}

function getTxRequestProps(): SmartContractRequestParams {
  let appAddress: string = appStore.appAddress

  if (!appAddress.startsWith('0x')) {
    appAddress = `0x${appAddress}`
  }

  return {
    privateKey: authStore.privateKey,
    appAddress,
    rpc: urlStore.rpcUrl,
    gateway: getEnvApi(),
    forwarderAddress: urlStore.forwarder,
    accessToken: authStore.accessToken,
  }
}

type SmartContractAcceptedValue =
  | (string | undefined | number)[]
  | (string | undefined)[][]

async function signerMakeTx(
  method: string,
  value?: SmartContractAcceptedValue
) {
  return await window.signerMakeTx({ ...getTxRequestProps(), method, value })
}

export default signerMakeTx

export type { SmartContractRequestParams }
