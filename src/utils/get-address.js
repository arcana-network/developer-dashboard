import { ethers } from "ethers";

export async function getAddress(hash) {
  if (hash.length === 42) {
    return hash;
  } else if (hash.length === 40) {
    return "0x" + hash;
  }
  if (!localStorage.getItem(hash)) {
    const provider = new ethers.providers.JsonRpcProvider(
      import.meta.env.VITE_ARCANA_RPC
    );
    let data = await (await provider.getTransaction(hash)).wait();
    if (!data.events) data.events = [];
    let abi = ["event NewApp(address owner, address appProxy)"];
    let iface = new ethers.utils.Interface(abi);
    let app_address = "";
    data.logs.map((d) => {
      if (d.topics.includes(iface.getEventTopic("NewApp"))) {
        const args = iface.parseLog(d).args;
        app_address = args.appProxy;
        localStorage.setItem(hash, app_address);
      }
    });
    return app_address;
  } else {
    return localStorage.getItem(hash);
  }
}
