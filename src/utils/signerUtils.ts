import { getConfig } from '@/services/gateway.service'
import { useAuthStore } from '@/stores/auth.store'
import type { Network } from '@/utils/constants'
import { api, isProductionDashboard } from '@/utils/constants'

const authStore = useAuthStore()

function getRequiredChainId(network: Network): {
  id: 137 | 80001
  hex: '0x89' | '0x13881'
} {
  if (isProductionDashboard && network === 'mainnet') {
    return {
      id: 137,
      hex: '0x89',
    }
  }
  return {
    id: 80001,
    hex: '0x13881',
  }
}

const ChainDetails = {
  '0x89': {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/polygon'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  '0x13881': {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/polygon_mumbai'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
}

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

  const config = getConfig(network)

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
  value: boolean,
  network: Network = 'mainnet'
) {
  const { appAddress, gateway, forwarderAddress, accessToken } =
    getTransactionRequestProps(address, network)
  const provider = window.arcana.provider
  const chainId = await provider?.request({ method: 'eth_chainId' })
  const requiredChainId = getRequiredChainId(network)
  if (Number(chainId) !== requiredChainId.id) {
    try {
      await provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: requiredChainId.hex,
          },
        ],
      })
    } catch (e) {
      if (e.code === 4902) {
        await provider?.request({
          method: 'wallet_addEthereumChain',
          params: [ChainDetails[requiredChainId.hex]],
        })
        await provider?.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: requiredChainId.hex,
            },
          ],
        })
      }
    }
  }
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
