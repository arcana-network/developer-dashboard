import store from '@/store'
import getEnvApi from '@/utils/get-env-api'

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
  let appAddress: string = store.getters.appAddress

  if (!appAddress.startsWith('0x')) {
    appAddress = `0x${appAddress}`
  }

  return {
    privateKey: store.getters.keys.privateKey,
    appAddress,
    rpc: store.getters.rpcUrl,
    gateway: getEnvApi(),
    forwarderAddress: store.getters.forwarder,
    accessToken: store.getters.accessToken,
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
