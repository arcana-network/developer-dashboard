import { getConfig } from '@/services/gateway.service'
import { useAuthStore } from '@/stores/auth.store'
import type { Network } from '@/utils/constants'
import getEnvApi from '@/utils/get-env-api'

const authStore = useAuthStore()

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

function getTransactionRequestProps(
  appAddress: string
): SmartContractRequestParams {
  if (!appAddress.startsWith('0x')) {
    appAddress = `0x${appAddress}`
  }

  const config = getConfig()

  return {
    appAddress,
    gateway: getEnvApi(),
    forwarderAddress: config.forwarder,
    accessToken: authStore.accessToken,
  }
}

async function createTransactionSigner(address: string) {
  const { appAddress, gateway, forwarderAddress, accessToken } =
    getTransactionRequestProps(address)
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

async function generateLoginInfo(network: Network) {
  const provider = window.arcana.provider
  const gateway = api.gateway[network]
  return await window.transactionSigner.generateLoginInfo({
    provider,
    gateway,
  })
}

const delegator = window.transactionSigner.delegator

export {
  getTransactionRequestProps,
  createTransactionSigner,
  signTransaction,
  hashJson,
  generateLoginInfo,
  delegator,
}

export type {
  SmartContractRequestParams,
  SmartContractAcceptedValue,
  TransactionSignerParams,
}
