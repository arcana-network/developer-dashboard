import store from '@/store'
import getEnvApi from '@/utils/get-env-api'

type SmartContractAcceptedValue = (string | undefined | number)[]

type TransactionSignerParams = {
  appAddress: string
  provider: any
  forwarderAddress: string
  gateway: string
  accessToken: string
}

type SmartContractRequestParams = {
  appAddress: string
  provider?: string
  forwarderAddress: string
  gateway: string
  accessToken: string
  method?: string
  value?: string
}

let signTransaction: (
  method: string,
  value?: SmartContractAcceptedValue
) => Promise<string>

function getTransactionRequestProps(): SmartContractRequestParams {
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

async function createTransactionSigner() {
  const { appAddress, gateway, forwarderAddress, accessToken } =
    getTransactionRequestProps()
  const provider = window.arcana.provider
  signTransaction = window.transactionSigner.createTransactionSigner({
    appAddress,
    provider,
    forwarderAddress,
    gateway,
    accessToken,
  })
}

function hashJson(data: any) {
  return window.transactionSigner.hashJson(data)
}

async function generateLoginInfo() {
  const provider = window.arcana.provider
  const gateway = getEnvApi()
  return await window.transactionSigner.generateLoginInfo({
    provider,
    gateway,
  })
}

export { createTransactionSigner, signTransaction, hashJson, generateLoginInfo }

export type {
  SmartContractRequestParams,
  SmartContractAcceptedValue,
  TransactionSignerParams,
}
