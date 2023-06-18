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
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    })
    return { provider }
  } catch (err) {
    console.log(err, 'Failed to switch to the network')
  }
}

function useMetaMask() {
  return { connect, switchChain }
}

export { useMetaMask }
