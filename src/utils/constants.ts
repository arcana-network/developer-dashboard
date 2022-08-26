import bytes from 'bytes'

import type { UserLimitState, SocialAuthOption } from '@/stores/apps.store'

const sentry = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracingOrigins: [import.meta.env.VITE_SENTRY_TRACING_ORIGINS, /^\//],
}

const api = {
  gateway: import.meta.env.VITE_GATEWAY_API,
  verify: import.meta.env.VITE_VERIFY_URI,
}

const arcanaAppId: string = import.meta.env.VITE_ARCANA_APP_ID

const isAppDown: boolean = import.meta.env.VITE_IS_APP_DOWN || false

const DOCS_URL: string = import.meta.env.VITE_DOCS_URL

type Chain = 'ethereum' | 'polygon' | 'binance' | 'none'

type ChainOption<T> = {
  label: string
  value: T
}

const chains: ChainOption<Chain>[] = [
  {
    label: 'None',
    value: 'none',
  },
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

const CONFIGURE_TABS: readonly ConfigureTab[] = [
  { type: 'general', label: 'General' },
  { type: 'auth', label: 'Auth' },
  { type: 'store', label: 'Store' },
  { type: 'access', label: 'Access' },
]

type BandwidthLimitUnit = {
  label: 'MB/mo' | 'GB/mo'
  value: 'MB' | 'GB'
}

const storageValues = ['MB', 'GB']

const unlimitedUserLimit: Readonly<UserLimitState> = {
  isUnlimited: true,
}
const defaultUserLimit: Readonly<UserLimitState> = {
  isUnlimited: false,
  value: 2,
  unit: 'MB',
}

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

const socialLogins: readonly SocialAuthOption[] = [
  {
    name: 'Google',
    verifier: 'google',
    hasClientSecret: false,
    hasRedirectUri: false,
    documentation: 'https://developers.google.com/identity/sign-in/web/sign-in',
  },
  {
    name: 'Twitch',
    verifier: 'twitch',
    hasClientSecret: false,
    hasRedirectUri: false,
    documentation: 'https://dev.twitch.tv/docs/authentication#registration',
  },
  {
    name: 'Discord',
    verifier: 'discord',
    hasClientSecret: true,
    hasRedirectUri: false,
    documentation: 'https://discord.com/developers/applications',
  },
  {
    name: 'Github',
    verifier: 'github',
    hasClientSecret: true,
    hasRedirectUri: false,
    documentation:
      'https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app',
  },
  {
    name: 'Twitter',
    verifier: 'twitter',
    hasClientSecret: true,
    hasRedirectUri: true,
    documentation: 'https://developer.twitter.com/en/docs/apps/overview',
  },
]

enum ChainMapping {
  ethereum = 0,
  polygon = 1,
  binance = 2,
  none = 3,
}

enum RegionMapping {
  'asia' = 1,
  'europe' = 4,
  'north-america' = 5,
}

enum WalletMode {
  NoUI = 0,
  UI = 1,
}

const MAX_DATA_TRANSFER_BYTES = bytes('10 TB')
const MAX_ALLOWED_APP_LIMIT = '5GB'
const MAX_ALLOWED_APP_LIMIT_IN_BYTES = bytes(MAX_ALLOWED_APP_LIMIT)

const constants = {
  sentry,
  api,
  arcanaAppId,
  isAppDown,
  chains,
  CONFIGURE_TABS,
  socialLogins,
  DOCS_URL,
}

export {
  sentry,
  api,
  arcanaAppId,
  isAppDown,
  chains,
  CONFIGURE_TABS,
  userLimitOptions,
  bandwidthUnits,
  storageValues,
  unlimitedUserLimit,
  defaultUserLimit,
  socialLogins,
  regions,
  type Region,
  type StorageRegion,
  type ConfigureTab,
  type ConfigureTabType,
  type Chain,
  type ChainOption,
  type BandwidthLimitUnit,
  ChainMapping,
  RegionMapping,
  WalletMode,
  MAX_DATA_TRANSFER_BYTES,
  MAX_ALLOWED_APP_LIMIT,
  MAX_ALLOWED_APP_LIMIT_IN_BYTES,
  DOCS_URL,
}

export default constants
