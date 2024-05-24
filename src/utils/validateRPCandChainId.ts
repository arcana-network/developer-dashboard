import { getChainIDUsingRPCUrl } from '@/services/gateway.service'

async function validateRPCandChainID(rpcURL: string, chainId: string) {
  const networkChainId = await getChainIDUsingRPCUrl(rpcURL)
  return Number(chainId) === networkChainId
}

export default validateRPCandChainID
