import bytes from 'bytes'

import type { AppConfig } from '@/services/gateway.service'
import {
  defaultUserLimit,
  unlimitedUserLimit,
  ChainMapping,
  RegionMapping,
  type Chain,
  type StorageRegion,
  MAX_DATA_TRANSFER_BYTES,
} from '@/utils/constants'

type UserLimitUnit = 'MB' | 'GB'
type UserLimitTarget = 'storage' | 'bandwidth'

type Logo = {
  mode: 'dark' | 'light'
  orientation: 'horizontal' | 'vertical'
  url: string
}

type UserLimitState =
  | {
      isUnlimited: true
    }
  | {
      isUnlimited: false
      value: number
      unit: UserLimitUnit
    }

type UserLimitParam =
  | {
      type: UserLimitTarget
      field: 'value'
      value: number
    }
  | {
      type: UserLimitTarget
      field: 'unit'
      value: UserLimitUnit
    }

type UserLimitUnlimitedParam = {
  type: UserLimitTarget
  isUnlimited: boolean
}

type SocialAuthVerifier =
  | 'google'
  | 'twitter'
  | 'twitch'
  | 'reddit'
  | 'github'
  | 'discord'

type SocialAuthField = 'clientId' | 'clientSecret' | 'redirectUri'

type SocialAuthOption = {
  name: 'Google' | 'Twitter' | 'Twitch' | 'Reddit' | 'Github' | 'Discord'
  verifier: SocialAuthVerifier
  hasClientSecret: boolean
  hasRedirectUri: boolean
  documentation: string
}

type SocialAuthUpdateParam = {
  verifier: SocialAuthVerifier
  field: SocialAuthField
  value: string
}

type SocialAuthState = {
  verifier: SocialAuthVerifier
  clientId?: string
  clientSecret?: string
  redirectUri?: string
}

type ConfigureState = {
  appName: string
  appId: string
  logos: {
    dark: {
      horizontal: string
      vertical: string
    }
    light: {
      horizontal: string
      vertical: string
    }
  }
  access: {
    selectedChain: Chain
  }
  auth: {
    social: SocialAuthState[]
    passwordless: {
      javascriptOrigin: string
      redirectUri: string
    }
    wallet: {
      websiteDomain: string
      selectedTheme: 'light' | 'dark'
      hasUIMode: boolean
    }
    redirectUri: string
  }
  store: {
    userLimits: {
      storage: UserLimitState
      bandwidth: UserLimitState
    }
    region: StorageRegion
  }
}

const defaultState: ConfigureState = {
  appName: '',
  appId: '',
  access: {
    selectedChain: 'ethereum',
  },
  logos: {
    dark: {
      horizontal: '',
      vertical: '',
    },
    light: {
      horizontal: '',
      vertical: '',
    },
  },
  auth: {
    social: [],
    passwordless: {
      javascriptOrigin: '',
      redirectUri: '',
    },
    redirectUri: '',
    wallet: {
      websiteDomain: '',
      selectedTheme: 'dark',
      hasUIMode: false,
    },
  },
  store: {
    userLimits: {
      storage: {
        isUnlimited: true,
      },
      bandwidth: {
        isUnlimited: true,
      },
    },
    region: 'asia',
  },
}

let state: ConfigureState = { ...defaultState }

const getters = {
  appName: (state: ConfigureState) => state.appName,
  appId: (state: ConfigureState) => state.appId,
  socialAuth: (state: ConfigureState) => state.auth.social,
  walletUIMode: (state: ConfigureState) => state.auth.wallet.hasUIMode,
  walletWebsiteDomain: (state: ConfigureState) =>
    state.auth.wallet.websiteDomain,
  selectedTheme: (state: ConfigureState) => state.auth.wallet.selectedTheme,
  selectedChain: (state: ConfigureState) => state.access.selectedChain,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
  storageLimit: (state: ConfigureState) => state.store.userLimits.storage,
  bandwidthLimit: (state: ConfigureState) => state.store.userLimits.bandwidth,
  storageRegion: (state: ConfigureState) => state.store.region,
  logos: (state: ConfigureState) => state.logos,
  redirectUri: (state: ConfigureState) => state.auth.redirectUri,
  appConfigRequestBody: (state: ConfigureState): AppConfig => {
    let storage_limit: number, bandwidth_limit: number

    const storageLimit = state.store.userLimits.storage
    const bandwidthLimit = state.store.userLimits.bandwidth
    if (storageLimit.isUnlimited) {
      storage_limit = MAX_DATA_TRANSFER_BYTES
    } else {
      storage_limit = bytes(`${storageLimit.value} ${storageLimit.unit}`)
    }

    if (bandwidthLimit.isUnlimited) {
      bandwidth_limit = MAX_DATA_TRANSFER_BYTES
    } else {
      bandwidth_limit = bytes(`${bandwidthLimit.value} ${bandwidthLimit.unit}`)
    }

    const socialAuth = state.auth.social
    const cred: {
      verifier: string
      clientId?: string
      clientSecret?: string
      redirectURL?: string
      origin?: string
    }[] = socialAuth.map((authType) => {
      return {
        verifier: authType.verifier,
        clientId: authType.clientId,
        clientSecret: authType.clientSecret,
        redirectURL: authType.redirectUri,
      }
    })

    if (
      state.auth.passwordless.javascriptOrigin &&
      state.auth.passwordless.redirectUri
    ) {
      cred.push({
        verifier: 'passwordless',
        origin: state.auth.passwordless.javascriptOrigin,
        redirectURL: state.auth.passwordless.redirectUri,
      })
    }

    return {
      name: state.appName,
      storage_limit,
      bandwidth_limit,
      cred,
      aggregate_login: true,
      chain: ChainMapping[state.access.selectedChain],
      region: RegionMapping[state.store.region],
      theme: state.auth.wallet.selectedTheme,
    }
  },
}

const mutations = {
  updateAppId(state: ConfigureState, appId: string) {
    state.appId = appId
  },
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
  updateSelectedChain(state: ConfigureState, selectedChain: Chain) {
    state.access.selectedChain = selectedChain
  },
  updateSelectedTheme(state: ConfigureState, selectedTheme: 'light' | 'dark') {
    state.auth.wallet.selectedTheme = selectedTheme
  },
  updatePasswordlessAuthJavascriptOrigin(
    state: ConfigureState,
    javascriptOrigin: string
  ) {
    state.auth.passwordless.javascriptOrigin = javascriptOrigin
  },
  updatePasswordlessAuthRedirectUri(
    state: ConfigureState,
    redirectUri: string
  ) {
    state.auth.passwordless.redirectUri = redirectUri
  },
  updateUserLimit(
    state: ConfigureState,
    { type, isUnlimited }: UserLimitUnlimitedParam
  ) {
    state.store.userLimits[type] = isUnlimited
      ? { ...unlimitedUserLimit }
      : { ...defaultUserLimit }
  },
  updateUserLimitField(
    state: ConfigureState,
    { type, field, value }: UserLimitParam
  ) {
    state.store.userLimits[type][field] = value
  },
  addSocialAuth(
    state: ConfigureState,
    { verifier, field, value }: SocialAuthUpdateParam
  ) {
    state.auth.social.push({
      verifier,
      [field]: value,
    })
  },
  updateSocialAuth(
    state: ConfigureState,
    { verifier, field, value }: SocialAuthUpdateParam
  ) {
    const exisitingAuth: SocialAuthState | undefined = state.auth.social.find(
      (auth) => auth.verifier === verifier
    )
    if (exisitingAuth) {
      exisitingAuth[field] = value
    }
  },
  removeSocialAuth(state: ConfigureState, verifier: SocialAuthVerifier) {
    state.auth.social = state.auth.social.filter(
      (auth) => auth.verifier !== verifier
    )
  },
  updateWalletUIMode(state: ConfigureState, hasUIMode: boolean) {
    state.auth.wallet.hasUIMode = hasUIMode
  },
  updateWalletWebsiteDomain(state: ConfigureState, websiteDomain: string) {
    state.auth.wallet.websiteDomain = websiteDomain
  },
  updateStorageRegion(state: ConfigureState, region: StorageRegion) {
    state.store.region = region
  },
  updateLogo(state: ConfigureState, { mode, orientation, url }: Logo) {
    state.logos[mode][orientation] = url
  },
  updateRedirectUri(state: ConfigureState, redirectUri: string) {
    state.auth.redirectUri = redirectUri
  },
  resetSettings() {
    state = { ...defaultState }
  },
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export type {
  UserLimitState,
  UserLimitParam,
  UserLimitTarget,
  UserLimitUnit,
  SocialAuthField,
  SocialAuthState,
  SocialAuthUpdateParam,
  SocialAuthOption,
  SocialAuthVerifier,
}

export default configureStore
