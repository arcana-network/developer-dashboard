import { signTypedData_v4 as signTypedMessage } from "./eth-sig-util";
import { Buffer } from "buffer"; //need this since Buffer is not defined on browser side

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
];

function getMetaTxTypeData(chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: "Arcana Forwarder",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "ForwardRequest",
  };
}

async function signTypedData(signer, from, data) {
  // If signer is a private key, use it to sign
  const privateKey = Buffer.from(signer.privateKey.replace(/^0x/, ""), "hex");
  return signTypedMessage(privateKey, { data });
}

async function buildRequest(forwarder, input) {
  const nonce = await forwarder
    .getNonce(input.from)
    .then((nonce) => nonce.toString());
  return { value: 0, gas: 1e6, nonce, ...input };
}

async function buildTypedData(forwarder, request) {
  const chainId = await forwarder.provider.getNetwork().then((n) => n.chainId);
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

async function signMetaTxRequest(signer, forwarder, input) {
  const request = await buildRequest(forwarder, input);
  const toSign = await buildTypedData(forwarder, request);
  const signature = await signTypedData(signer, input.from, toSign);
  return { signature, request };
}

export async function sign(signer, arcana, forwarder, method, params) {
  const { request, signature } = await signMetaTxRequest(signer, forwarder, {
    from: signer.address,
    to: arcana.address,
    data: arcana.interface.encodeFunctionData(method, params),
  });
  request["signature"] = signature.replace("0x", "");
  request["from"] = request["from"].replace("0x", "");
  request["to"] = request["to"].replace("0x", "");
  request["data"] = request["data"].replace("0x", "");
  request["nonce"] = parseInt(request["nonce"]);
  return request;
}
