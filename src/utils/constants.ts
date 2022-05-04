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

type ConfigureTab = 'general' | 'auth' | 'store' | 'access' | 'wallet'

const CONFIGURE_TABS = [
  { type: 'general', label: 'General' },
  { type: 'auth', label: 'Auth' },
  { type: 'store', label: 'Store' },
  { type: 'access', label: 'Access' },
  { type: 'wallet', label: 'Wallet' },
]

const constants = {
  sentry,
  api,
  arcanaAppId,
  isAppDown,
  chains,
  CONFIGURE_TABS,
}

export {
  sentry,
  api,
  arcanaAppId,
  isAppDown,
  chains,
  CONFIGURE_TABS,
  type ConfigureTab,
}

export default constants
