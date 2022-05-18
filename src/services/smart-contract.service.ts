import signerMakeTx from '@/utils/signerMakeTx'

async function setAppName(appName: string) {
  await signerMakeTx('setAppName', [appName])
}

async function setDefaultLimit(storage: number, bandwidth: number) {
  await signerMakeTx('setDefaultLimit', [storage, bandwidth])
}

async function setClientIds(socialAuth: any[]) {
  const authSignerMakeTxValue: string[][] = [[], []]
  socialAuth?.forEach((authDetail) => {
    if (authDetail.verifier !== 'passwordless' && authDetail.clientId) {
      authSignerMakeTxValue[0].push(authDetail.verifier)
      authSignerMakeTxValue[1].push(authDetail.clientId)
    }
  })
  await signerMakeTx('setClientIds', authSignerMakeTxValue)
}

export { setAppName, setDefaultLimit, setClientIds }
