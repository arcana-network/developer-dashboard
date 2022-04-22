import { Wallet } from "ethers";

export default async function (privateKey, nonce) {
  const wallet = new Wallet(privateKey);
  return await wallet.signMessage(`${nonce}`);
}
