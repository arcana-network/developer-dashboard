import { ethers } from 'ethers'

export function generateKey() {
  return ethers.Wallet.createRandom()
}
