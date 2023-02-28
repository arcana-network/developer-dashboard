/* eslint-disable import/no-anonymous-default-export */

const getAppId = (path) => {
  // const pattern = new URLPattern(
  //   `${process.env.VUE_APP_WALLET_RPC_URL}/:appId/*`
  // )
  // const r = pattern.exec(path)
  // return r.pathname.groups.appId
  return '121'
}

const fetchDomain = async (appId) => {
  // const res = await fetch(
  //   `${process.env.VUE_APP_WALLET_GATEWAY}/app/${appId}/domain`
  // )
  // if (res.status < 400) {
  //   const data = await res.json()
  //   return data.domain
  // } else {
  //   throw new Error('Invalid AppId')
  // }
  return 'google.com'
}

export default async (req, context) => {
  const res = await context.next()
  const { headers } = res
  try {
    const appId = getAppId(req.url)
    const domain = await fetchDomain(appId)
    if (domain) {
      headers.set('Content-Security-Policy', `frame-ancestors ${domain}`)
    }
    return new Response(res.text(), { ...res, headers })
  } catch (e) {
    const response = JSON.stringify({ message: 'Not allowed' })
    return new Response(response, { status: 403 })
  }
}
