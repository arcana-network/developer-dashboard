const provider = window.ethereum

async function connect() {
  if (provider === undefined) {
    throw new Error('Please install Meta Mask')
  }

  const [address] = await provider.request({
    method: 'eth_requestAccounts',
  })
  return { address, provider }
}

async function switchChain(chainId: string) {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }],
  })
  return provider
}

async function checkConnection() {
  return await provider.request({ method: 'eth_accounts' })
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
  return provider
}

function useMetaMask() {
  return { connect, switchChain, createChain, checkConnection }
}

export { useMetaMask }
