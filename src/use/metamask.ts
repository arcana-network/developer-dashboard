let provider

async function connect() {
  provider = window.ethereum

  if (provider === undefined) {
    throw new Error('Please install Meta Mask')
  }

  const [address] = await provider.request({
    method: 'eth_requestAccounts',
  })
  return { address, provider }
}

async function switchChain(chainId: number) {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }],
  })
}

async function createChain(chainInfo) {
  const params = [
    {
      chainId: `0x${Number(chainInfo.chain_id).toString(16)}`,
      chainName: chainInfo.name,
      rpcUrls: [chainInfo.rpc_url],
      nativeCurrency: {
        symbol: chainInfo.currency,
        decimals: 18,
      },
    },
  ]
  await provider.request({
    method: 'wallet_addEthereumChain',
    params,
  })
}

function useMetaMask() {
  return { connect, switchChain, createChain }
}

export { useMetaMask }
