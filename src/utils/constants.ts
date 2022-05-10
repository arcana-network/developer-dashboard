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

const CONFIGURE_TABS: ConfigureTab[] = [
  { type: 'general', label: 'General' },
  { type: 'auth', label: 'Auth' },
  { type: 'store', label: 'Store' },
  { type: 'access', label: 'Access' },
  { type: 'wallet', label: 'Wallet' },
]

type SocialLogin = {
  name: 'Google' | 'Twitter' | 'Twitch' | 'Reddit' | 'Github' | 'Discord'
  verifier: 'google' | 'twitter' | 'twitch' | 'reddit' | 'github' | 'discord'
  hasClientSecret: boolean
  hasRedirectUri: boolean
  documentation: string
  clientId?: string
  clientSecret?: string
  redirectUri?: string
}

type SocialAuth = {
  verifier: string
  clientId?: string
  clientSecret?: string
  redirectUri?: string
}

const socialLogins: SocialLogin[] = [
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
  socialLogins,
  regions,
  type Region,
  type StorageRegion,
  type ConfigureTab,
  type ConfigureTabType,
  type SocialLogin,
  type SocialAuth,
  type Chain,
  type ChainOption,
}

export default constants
