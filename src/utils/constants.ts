import type { UserLimitState } from '@/store/configure.store'

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

type Chain = 'ethereum' | 'polygon' | 'binance'

type ChainOption<T> = {
  label: string
  value: T
}

const chains: ChainOption<Chain>[] = [
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

type StorageRegion = 'asia' | 'europe' | 'north-america'

type Region = {
  name: string
  value: StorageRegion
}

const regions: Region[] = [
  {
    name: 'Asia',
    value: 'asia',
  },
  {
    name: 'Europe',
    value: 'europe',
  },
  {
    name: 'North America',
    value: 'north-america',
  },
]

type ConfigureTabType = 'general' | 'auth' | 'store' | 'access' | 'wallet'

type ConfigureTab = {
  type: ConfigureTabType
  label: string
}

const userLimitOptions: string[] = ['Limited', 'Unlimited']

const CONFIGURE_TABS: ConfigureTab[] = [
  { type: 'general', label: 'General' },
  { type: 'auth', label: 'Auth' },
  { type: 'store', label: 'Store' },
  { type: 'access', label: 'Access' },
  { type: 'wallet', label: 'Wallet' },
]

type BandwidthLimitUnit = {
  label: 'MB/mo' | 'GB/mo'
  value: 'MB' | 'GB'
}

const unlimitedUserLimit: UserLimitState = {
  isUnlimited: true,
}

const defaultUserLimit: UserLimitState = {
  isUnlimited: false,
  value: 2,
  unit: 'MB',
}

const storageValues = ['MB', 'GB']

const bandwidthUnits: BandwidthLimitUnit[] = [
  {
    label: 'MB/mo',
    value: 'MB',
  },
  {
    label: 'GB/mo',
    value: 'GB',
  },
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
  userLimitOptions,
  unlimitedUserLimit,
  defaultUserLimit,
  bandwidthUnits,
  storageValues,
  regions,
  type Region,
  type StorageRegion,
  type ConfigureTab,
  type ConfigureTabType,
  type Chain,
  type ChainOption,
  type BandwidthLimitUnit,
}

export default constants
