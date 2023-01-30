import { getConfig } from '@/services/gateway.service'
import { useAuthStore } from '@/stores/auth.store'
import type { Network } from '@/utils/constants'
import { api } from '@/utils/constants'

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
  appAddress: string,
  network: Network
): SmartContractRequestParams {
  if (!appAddress.startsWith('0x')) {
    appAddress = `0x${appAddress}`
  }

  const config = getConfig()

  return {
    appAddress,
    gateway: new URL('/api/v1', api.gateway[network]).toString(),
    forwarderAddress: config.forwarder,
    accessToken: authStore.accessToken[network],
  }
}

async function createTransactionSigner(address: string, network: Network) {
  const { appAddress, gateway, forwarderAddress, accessToken } =
    getTransactionRequestProps(address, network)
  const provider = window.arcana.provider
  signTransaction = window.transactionSigner.createTransactionSigner({
    appAddress,
    provider,
    forwarderAddress,
    gateway,
    accessToken,
  })
}

async function signTransactionV2(
  address: string,
  method: string,
  value: boolean
) {
  const { appAddress, gateway, forwarderAddress, accessToken } =
    getTransactionRequestProps(address, 'mainnet')
  const provider = window.arcana.provider
  return await window.transactionSigner.signTransactionV2({
    appAddress,
    provider,
    forwarderAddress,
    gateway,
    accessToken,
    method,
    value: [value],
  })
}

function hashJson(data: any) {
  return window.transactionSigner.hashJson(data)
}

async function generateLoginInfo(network: Network) {
  const provider = window.arcana.provider
  const gateway = new URL('/api/v1', api.gateway[network]).toString()
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
  signTransactionV2,
}

export type {
  SmartContractRequestParams,
  SmartContractAcceptedValue,
  TransactionSignerParams,
}
