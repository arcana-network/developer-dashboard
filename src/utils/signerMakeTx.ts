import getEnvApi from '@/services/get-env-api'
import store from '@/store'

function getTxRequestProps() {
  return {
    privateKey: store.getters.keys.privateKey,
    appAddress: store.getters.smartContractAddress,
    rpc: store.getters['test/rpc'],
    gateway: getEnvApi(),
    forwarderAddress: store.getters['test/forwarder'],
    accessToken: store.getters.accessToken,
  }
}

async function signerMakeTx(method, value) {
  return await window.signerMakeTx({ ...getTxRequestProps(), method, value })
}

export default signerMakeTx
