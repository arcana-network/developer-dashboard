import bytes from 'bytes'

import AppleIcon from '@/assets/apple-sso.svg'
import CognitoIcon from '@/assets/cognito-sso.png'
import DiscordIcon from '@/assets/discord-sso.svg'
import FirebaseIcon from '@/assets/firebase-sso.svg'
import GithubIcon from '@/assets/github-sso-light.svg'
import GoogleIcon from '@/assets/google-sso.svg'
import brandingIcon from '@/assets/iconography/branding.svg'
import BugIcon from '@/assets/iconography/bug.png'
import dashboardIcon from '@/assets/iconography/dashboard.svg'
import DocsIcon from '@/assets/iconography/docs.svg'
import InvoiceIcon from '@/assets/iconography/invoices.svg'
import PassportIcon from '@/assets/iconography/passport.svg'
import ScheduleIcon from '@/assets/iconography/schedule.svg'
import settingsIcon from '@/assets/iconography/settings.svg'
import SteamIcon from '@/assets/iconography/steam-sso.svg'
import socialMediaIcon from '@/assets/iconography/user.svg'
import walletIcon from '@/assets/iconography/wallet.svg'
import TelegramIcon from '@/assets/telegram.svg'
import TwitchIcon from '@/assets/twitch-sso.svg'
import TwitterIcon from '@/assets/twitter-sso.svg'

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
  appleRedirct: {
    dev: 'https://oauth.arcana.network',
    testnet: 'https://oauth-testnet.arcana.network',
    mainnet: 'https://api-auth.arcana.network',
  },
}

const isAppDown: boolean = import.meta.env.VITE_IS_APP_DOWN || false
const isProductionDashboard: boolean =
  import.meta.env.VITE_ARCANA_AUTH_NETWORK === 'mainnet'

const NetworkName = {
  testnet: isProductionDashboard ? 'Testnet' : 'Dev',
  mainnet: isProductionDashboard ? 'Mainnet' : 'Testnet',
}

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
  | 'Gasless'

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

const EMPTY_STRING = ''

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
  | 'apple'
  | 'twitter'
  | 'twitch'
  | 'telegram'
  | 'reddit'
  | 'github'
  | 'discord'
  | 'aws'
  | 'steam'
  | 'firebase'
  | 'passkey'

type SocialAuthVerifierLabel =
  | 'Google'
  | 'Apple'
  | 'Twitter'
  | 'Twitch'
  | 'Telegram'
  | 'Reddit'
  | 'GitHub'
  | 'Discord'
  | 'Cognito'
  | 'Steam'
  | 'Firebase'
  | 'Passkey'

type SocialAuthOptionTitle = {
  label1: string
  label2: string
  label3: string
  label4: string
  label5: string
}

type SocialAuthOptionDocumentation = {
  label: string
  link: string
}

type SocialAuthOption = {
  name: SocialAuthVerifierLabel
  icon?: string
  verifier: SocialAuthVerifier
  hasClientSecret: boolean
  isApple: boolean
  documentation?: string
  inputLabels: SocialAuthOptionTitle
  documentation1: SocialAuthOptionDocumentation
  documentation2?: SocialAuthOptionDocumentation
  clientId?: string
  clientSecret?: string
  privateKey?: string
  teamId?: string
  keyId?: string
  note?: string
  provider?: string
}

const passkeyLogins: readonly SocialAuthOption[] = [
  {
    name: 'Passkey',
    verifier: 'passkey',
    hasClientSecret: true,
    isApple: false,
    documentation:
      'https://docs.arcana.network/concepts/authtype/auth-passkeys',
    inputLabels: {
      label1: 'Domain',
      label2: '',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'What is domain?',
      link: 'https://docs.arcana.network/concepts/authtype/auth-passkeys/#domain',
    },
    clientSecret: '',
    provider: '',
  },
]

const socialLogins: readonly SocialAuthOption[] = [
  {
    name: 'Google',
    verifier: 'google',
    icon: GoogleIcon,
    hasClientSecret: false,
    isApple: false,
    documentation: 'https://support.google.com/cloud/answer/6158849?hl=en',
    inputLabels: {
      label1: 'Client ID',
      label2: '',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Client ID',
      link: 'https://support.google.com/cloud/answer/6158849?hl=en',
    },
    clientId: '',
    clientSecret: '',
    note: 'Note: If you enable Cognito as one of the multiple onboarding options then you can directly configure Google login through Cognito itself instead of using Arcana Dashboard.',
  },
  {
    name: 'Apple',
    verifier: 'apple',
    icon: AppleIcon,
    hasClientSecret: true,
    isApple: true,
    documentation:
      'https://docs.arcana.network/auth/onboard/react-nextjs/custom-ui/build-social/apple-oauth/',
    inputLabels: {
      label1: 'Service ID',
      label2: '',
      label3: 'Team ID',
      label4: 'Key ID',
      label5: 'Private Key',
    },
    documentation1: {
      label: 'Get your Client ID',
      link: 'https://docs.arcana.network/setup/config-social/apple-oauth/',
    },
    clientId: '',
    clientSecret: '',
    privateKey: '',
    teamId: '',
    keyId: '',
    note: 'Note: If you enable Cognito as one of the multiple onboarding options then you can directly configure Google login through Cognito itself instead of using Arcana Dashboard.',
  },
  {
    name: 'Twitch',
    verifier: 'twitch',
    icon: TwitchIcon,
    hasClientSecret: false,
    isApple: false,
    documentation: 'https://dev.twitch.tv/docs/authentication#registration',
    inputLabels: {
      label1: 'Client ID',
      label2: '',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Client ID',
      link: 'https://dev.twitch.tv/docs/authentication#registration',
    },
    clientId: '',
    clientSecret: '',
  },
  {
    name: 'Telegram',
    verifier: 'telegram',
    icon: TelegramIcon,
    hasClientSecret: true,
    isApple: false,
    documentation: '',
    inputLabels: {
      label1: '',
      label2: 'Bot Token',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Bot Token',
      link: 'https://core.telegram.org/bots/tutorial#obtain-your-bot-token',
    },
    clientSecret: '',
  },
  {
    name: 'Discord',
    verifier: 'discord',
    icon: DiscordIcon,
    hasClientSecret: true,
    isApple: false,
    documentation: 'https://discord.com/developers/applications',
    inputLabels: {
      label1: 'Application ID',
      label2: 'Public Key',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Client ID',
      link: 'https://discord.com/developers/applications',
    },
    documentation2: {
      label: 'Get your Client Secret',
      link: 'https://discord.com/developers/applications',
    },
    clientId: '',
    clientSecret: '',
  },
  {
    name: 'GitHub',
    verifier: 'github',
    icon: GithubIcon,
    hasClientSecret: true,
    isApple: false,
    documentation:
      'https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app',
    inputLabels: {
      label1: 'Client ID',
      label2: 'Client Secret',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Client ID',
      link: 'https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app',
    },
    documentation2: {
      label: 'Get your Client Secret',
      link: 'https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app',
    },
    clientId: '',
    clientSecret: '',
  },
  {
    name: 'Twitter',
    verifier: 'twitter',
    icon: TwitterIcon,
    hasClientSecret: true,
    isApple: false,
    documentation: 'https://developer.twitter.com/en/docs/apps/overview',
    inputLabels: {
      label1: 'API Key',
      label2: 'API Key Secret',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Client ID',
      link: 'https://developer.twitter.com/en/docs/apps/overview',
    },
    documentation2: {
      label: 'Get your Client Secret',
      link: 'https://developer.twitter.com/en/docs/apps/overview',
    },
    clientId: '',
    clientSecret: '',
  },
  {
    name: 'Steam',
    verifier: 'steam',
    icon: SteamIcon,
    hasClientSecret: true,
    isApple: false,
    documentation: 'https://steamcommunity.com/dev/apikey',
    inputLabels: {
      label1: '',
      label2: 'Steam API Key',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Steam API key',
      link: 'https://steamcommunity.com/dev/apikey',
    },
    documentation2: {
      label: 'Get your Steam API key',
      link: 'https://steamcommunity.com/dev/apikey',
    },
    clientId: '',
    clientSecret: '',
    note: 'Note: When you are a Steam member, and have already spent more than 5.00 USD in the store you should be able to request your Steam API Key.',
  },
]

const IAM_Providers: SocialAuthOption[] = [
  {
    name: 'Firebase',
    verifier: 'firebase',
    icon: FirebaseIcon,
    hasClientSecret: false,
    isApple: false,
    inputLabels: {
      label1: 'Project ID',
      label2: '',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Project ID',
      link: 'https://firebase.google.com/docs/projects/learn-more#project-id',
    },
    clientId: '',
    clientSecret: '',
  },
  {
    name: 'Cognito',
    verifier: 'aws',
    icon: CognitoIcon,
    hasClientSecret: true,
    isApple: false,
    inputLabels: {
      label1: 'Client ID',
      label2: 'Cognito User Pool Domain',
      label3: '',
      label4: '',
      label5: '',
    },
    documentation1: {
      label: 'Get your Client ID',
      link: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html',
    },
    documentation2: {
      label: 'Get your User Pool Domain',
      link: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain.html',
    },
    clientId: '',
    clientSecret: '',
    note: 'Note: If you enable Cognito as one of the multiple onboarding options then you can directly configure Google login through Cognito itself instead of using Arcana Dashboard.',
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

enum WalletUIMode {
  'Custom' = 0,
  'Arcana' = 1,
}

const WalletUIModes = [
  { value: 0, label: 'Custom UI' },
  { value: 1, label: 'Arcana UI' },
]

const ShardValues = [
  { value: 'none', label: 'None' },
  { value: '0', label: 'Shard 0' },
  { value: '1', label: 'Shard 1' },
  { value: '2', label: 'Shard 2' },
]

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
  {
    label: 'Invoices',
    icon: InvoiceIcon,
  },
]

const GLOBAL_KEYSPACE = 'global'

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
  socialLogins,
  passkeyLogins,
  regions,
  ChainMapping,
  RegionMapping,
  WalletMode,
  MAX_DATA_TRANSFER_BYTES,
  DOCS_URL,
  isProductionDashboard,
  NetworkName,
  HelpItems,
  ProfileItems,
  WalletUIModes,
  IAM_Providers,
  EMPTY_STRING,
  GLOBAL_KEYSPACE,
  ShardValues,
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
  WalletUIMode,
  SocialAuthOption,
}

export default constants
