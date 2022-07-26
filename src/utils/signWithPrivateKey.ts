import { Wallet } from 'ethers'

export default async function signWithPrivateKey(
  privateKey: string,
  nonce: number
) {
  const wallet = new Wallet(privateKey)
  return await wallet.signMessage(`${nonce}`)
}
