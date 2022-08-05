import store from '@/store'
import getEnvApi from '@/utils/get-env-api'

const provider = window.arcana.provider

type SmartContractRequestParams = {
  appAddress: string
  provider?: string
  forwarderAddress: string
  gateway: string
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
    appAddress,
    gateway: getEnvApi(),
    forwarderAddress: store.getters.forwarder,
    accessToken: store.getters.accessToken,
  }
}

type SmartContractAcceptedValue =
  | (string | undefined | number)[]
  | (string | undefined)[][]

async function signTransaction(
  method: string,
  value?: SmartContractAcceptedValue
) {
  const { appAddress, gateway, forwarderAddress, accessToken } =
    getTxRequestProps()

  const signTransaction = window.transactionSinger.create({
    appAddress,
    provider,
    forwarderAddress,
  })

  await signTransaction({ gateway, accessToken, method, value })
}

function hashJson(data: any) {
  return window.transactionSinger.hashJson(data)
}

async function generateLoginInfo() {
  const gateway = getEnvApi()
  return await window.transactionSinger.generateLoginInfo({
    provider,
    gateway,
  })
}

export { signTransaction, hashJson, generateLoginInfo }

export type { SmartContractRequestParams }