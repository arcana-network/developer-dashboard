import bytes from 'bytes'

import brandingIcon from '@/assets/iconography/branding.svg'
import BugIcon from '@/assets/iconography/bug.png'
import dashboardIcon from '@/assets/iconography/dashboard.svg'
import DocsIcon from '@/assets/iconography/docs.svg'
import PassportIcon from '@/assets/iconography/passport.svg'
import ScheduleIcon from '@/assets/iconography/schedule.svg'
import settingsIcon from '@/assets/iconography/settings.svg'
import socialMediaIcon from '@/assets/iconography/user.svg'
import walletIcon from '@/assets/iconography/wallet.svg'
import type { UserLimitState } from '@/stores/apps.store'

const docs_url = import.meta.env.VITE_ARCANA_DOCS_URL

const sentry = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracingOrigins: [import.meta.env.VITE_SENTRY_TRACING_ORIGINS, /^\//],
}

const api = {
  gateway: {
    mainnet: import.meta.env.VITE_ARCANA_GATEWAY_MAINNET_URL,
    testnet: import.meta.env.VITE_ARCANA_GATEWAY_TESTNET_URL,
  },
  verify: {
    mainnet: import.meta.env.VITE_ARCANA_VERIFY_MAINNET_URL,
    testnet: import.meta.env.VITE_ARCANA_VERIFY_TESTNET_URL,
  },
}

const isAppDown: boolean = import.meta.env.VITE_IS_APP_DOWN || false

const DOCS_URL: string = import.meta.env.VITE_ARCANA_DOCS_URL

type Chain = 'ethereum' | 'polygon' | 'binance' | 'none'

type Network = 'mainnet' | 'testnet'

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

type ConfigureTabType =
  | 'Dashboard'
  | 'Configure'
  | 'Branding'
  | 'Social Auth'
  | 'Arcana Wallet'
  | 'Profile'
  | 'Keyspace'

type ConfigureTabSubMenu = {
  type: string
  label: ConfigureTabType
  icon: string
}

type ConfigureTab = {
  type: string
  label: ConfigureTabType
  icon: string
  subMenu?: ConfigureTabSubMenu[]
}

const userLimitOptions: string[] = ['Limited', 'Unlimited']

const CONFIGURE_TABS: readonly ConfigureTab[] = [
  { type: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
  {
    type: 'configure',
    label: 'Configure',
    icon: settingsIcon,
    subMenu: [
      {
        type: 'branding',
        label: 'Branding',
        icon: brandingIcon,
      },
      {
        type: 'socialAuth',
        label: 'Social Auth',
        icon: socialMediaIcon,
      },
      {
        type: 'arcanaWallet',
        label: 'Arcana Wallet',
        icon: walletIcon,
      },
    ],
  },
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

type SocialAuthVerifier =
  | 'google'
  | 'twitter'
  | 'twitch'
  | 'reddit'
  | 'github'
  | 'discord'
  | 'aws'

type SocialAuthVerifierLabel =
  | 'Google'
  | 'Twitter'
  | 'Twitch'
  | 'Reddit'
  | 'GitHub'
  | 'Discord'
  | 'AWS'

type SocialAuthOption = {
  name: SocialAuthVerifierLabel
  verifier: SocialAuthVerifier
  hasClientSecret: boolean
  documentation: string
}

const socialLogins: readonly SocialAuthOption[] = [
  {
    name: 'Google',
    verifier: 'google',
    hasClientSecret: false,
    documentation: 'https://developers.google.com/identity/sign-in/web/sign-in',
  },
  {
    name: 'Twitch',
    verifier: 'twitch',
    hasClientSecret: false,
    documentation: 'https://dev.twitch.tv/docs/authentication#registration',
  },
  {
    name: 'Discord',
    verifier: 'discord',
    hasClientSecret: true,
    documentation: 'https://discord.com/developers/applications',
  },
  {
    name: 'GitHub',
    verifier: 'github',
    hasClientSecret: true,
    documentation:
      'https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app',
  },
  {
    name: 'Twitter',
    verifier: 'twitter',
    hasClientSecret: true,
    documentation: 'https://developer.twitter.com/en/docs/apps/overview',
  },
  {
    name: 'AWS',
    verifier: 'aws',
    hasClientSecret: true,
    documentation: 'https://docs.aws.amazon.com/cognito/index.html',
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

const HelpItems = [
  {
    label: 'View Docs',
    link: docs_url,
    icon: DocsIcon,
  },
  {
    label: 'Schedule a Demo',
    link: 'https://calendly.com/arcana-network/arcana-demo-walkthrough',
    icon: ScheduleIcon,
  },
  {
    label: 'Report a Bug',
    link: 'https://github.com/orgs/arcana-network/discussions',
    icon: BugIcon,
  },
]

const ProfileItems = [
  {
    label: 'Profile',
    icon: PassportIcon,
  },
  // {
  //   label: 'Invoices',
  //   icon: InvoiceIcon,
  // },
]

const constants = {
  sentry,
  api,
  isAppDown,
  chains,
  CONFIGURE_TABS,
  socialLogins,
  DOCS_URL,
}

export {
  sentry,
  api,
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
  ChainMapping,
  RegionMapping,
  WalletMode,
  MAX_DATA_TRANSFER_BYTES,
  DOCS_URL,
  HelpItems,
  ProfileItems,
}

export type {
  Region,
  StorageRegion,
  ConfigureTab,
  ConfigureTabType,
  Chain,
  ChainOption,
  BandwidthLimitUnit,
  SocialAuthVerifier,
  SocialAuthVerifierLabel,
  Network,
}

export default constants
