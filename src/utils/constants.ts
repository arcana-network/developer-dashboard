const sentry = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracingOrigins: [
    import.meta.env.VITE_SENTRY_TRACING_ORIGINS.split(','),
    /^\//,
  ],
}

const api = {
  testnet: import.meta.env.VITE_TESTNET_API,
}

const arcanaAppId = import.meta.env.VITE_ARCANA_APP_ID

const isAppDown = import.meta.env.VITE_IS_APP_DOWN || false

const chains = [
  {
    label: 'Ethereum',
    value: 'ethereum',
  },
  {
    label: 'Polygon',
    value: 'polygon',
  },
  {
    label: 'Binance',
    value: 'binance',
  },
]

const constants = {
  sentry,
  api,
  arcanaAppId,
  isAppDown,
  chains,
}

console.log(import.meta.env)

export default constants
