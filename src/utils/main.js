import store from "../store";
import getEnvApi from "../services/get-env-api";

import arcana from "./contracts/IArcana.sol/IArcana.json";
import forwarder from "./contracts/IForwarder.sol/IForwarder.json";
import { ethers } from "ethers";
import axios from "axios";
import { sign } from "./signer.js";

const forwarderAddress = import.meta.env.VITE_ARCANA_FORWARDER_ADDRESS;
const RPC = import.meta.env.VITE_ARCANA_RPC;

export async function makeTx(appAddress, method, params) {
  let wallet = new ethers.Wallet(store.getters.keys.privateKey);
  const arcanaContract = new ethers.Contract(appAddress, arcana.abi, wallet);
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const forwarderContract = new ethers.Contract(
    forwarderAddress,
    forwarder.abi,
    provider
  );
  let req = await sign(
    wallet,
    arcanaContract,
    forwarderContract,
    method,
    params
  );
  let res = await axios.post(getEnvApi() + "/api/meta-tx/", req, {
    headers: {
      Authorization: "Bearer " + store.getters.accessToken,
    },
  });
  let tx = await provider.getTransaction(res.data.txHash);
  await tx.wait();
  console.log(method, "Done");
  return res.data;
}

// (async () => {
//   await makeTx("0x3422a33BafBaa2c6Df0ae08662995b4C02372282", "setAppName", [
//     "skizzle",
//   ]);
//   await makeTx(
//     "0x3422a33BafBaa2c6Df0ae08662995b4C02372282",
//     "setGoogleClientId",
//     ["google"]
//   );
//   await makeTx(
//     "0x3422a33BafBaa2c6Df0ae08662995b4C02372282",
//     "setTwitchClientId",
//     ["twitch"]
//   );
//   await makeTx(
//     "0x3422a33BafBaa2c6Df0ae08662995b4C02372282",
//     "setDiscordClientId",
//     ["discord"]
//   );
//   await makeTx(
//     "0x3422a33BafBaa2c6Df0ae08662995b4C02372282",
//     "setRedditClientId",
//     ["reddit"]
//   );
//   await makeTx(
//     "0x3422a33BafBaa2c6Df0ae08662995b4C02372282",
//     "setTwitterClientId",
//     ["twitter"]
//   );
//   // storage, bandwidth
//   await makeTx(
//     "0x3422a33BafBaa2c6Df0ae08662995b4C02372282",
//     "setDefaultLimit",
//     [1000, 2000]
//   );
// })();
