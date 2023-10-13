import { useMetaMask } from '@/use/metamask'

async function connectWallet(
  selectedChainId: number,
  chainList: Array<object>
) {
  const { connect, switchChain, createChain } = useMetaMask()
  try {
    const { provider } = await connect()
    const connectedChainId = Number.parseInt(provider.chainId)
    if (connectedChainId !== selectedChainId) {
      return await switchChain(`0x${selectedChainId.toString(16)}`)
    } else return provider
  } catch (error) {
    if (error.code === 4902) {
      const chainInfo = chainList.find(
        (item) => item.chain_id === selectedChainId
      )
      return await createChain(chainInfo)
    } else throw error
  }
}

export { connectWallet }
