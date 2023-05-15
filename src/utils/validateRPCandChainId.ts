import { getChainIDUsingRPCUrl } from '@/services/gateway.service'

async function validateRPCandChainID(rpcURL: string, chainId: string) {
  const {
    data: { result },
  } = await getChainIDUsingRPCUrl(rpcURL)
  const networkChainId = parseInt(result, 16)
  return Number(chainId) === networkChainId
}

export default validateRPCandChainID
