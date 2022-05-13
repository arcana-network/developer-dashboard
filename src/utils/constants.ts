import type { UserLimitState, SocialAuthOption } from '@/store/configure.store'

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

const arcanaAppId: string = import.meta.env.VITE_ARCANA_APP_ID

const isAppDown: boolean = import.meta.env.VITE_IS_APP_DOWN || false

type Chain = 'ethereum' | 'polygon' | 'binance'

type ChainOption<T> = {
  label: string
  value: T
}

const chains: readonly ChainOption<Chain>[] = [
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
    name: 'Discord',
    verifier: 'discord',
    hasClientSecret: false,
    hasRedirectUri: false,
    documentation: 'https://canary.discord.com/developers/applications',
  },
  {
    name: 'Twitch',
    verifier: 'twitch',
    hasClientSecret: false,
    hasRedirectUri: false,
    documentation: 'https://dev.twitch.tv/docs/authentication#registration',
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

const constants = {
  sentry,
  api,
  arcanaAppId,
  isAppDown,
  chains,
  CONFIGURE_TABS,
  socialLogins,
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
}

export default constants
