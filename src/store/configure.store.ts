import {
  defaultUserLimit,
  unlimitedUserLimit,
  type Chain,
  type StorageRegion,
} from '@/utils/constants'

type UserLimitUnit = 'MB' | 'GB'
type UserLimitTarget = 'storage' | 'bandwidth'

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
  selectedTheme: string
  isAppConfigured: boolean
  access: {
    selectedChain: Chain
  }
  auth: {
    social: SocialAuthState[]
    passwordless: {
      javascriptOrigin: string
      redirectUri: string
    }
    hasAggregateLogin: boolean
  }
  store: {
    userLimits: {
      storage: UserLimitState
      bandwidth: UserLimitState
    }
    region: StorageRegion
  }
}

const state: ConfigureState = {
  appName: '',
  appId: '',
  selectedTheme: 'light',
  isAppConfigured: false,
  access: {
    selectedChain: 'ethereum',
  },
  auth: {
    social: [],
    passwordless: {
      javascriptOrigin: '',
      redirectUri: '',
    },
    hasAggregateLogin: false,
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

const getters = {
  appName: (state: ConfigureState) => state.appName,
  appId: (state: ConfigureState) => state.appId,
  selectedTheme: (state: ConfigureState) => state.selectedTheme,
  isAppConfigured: (state: ConfigureState) => state.isAppConfigured,
  hasAggregateLogin: (state: ConfigureState) => state.auth.hasAggregateLogin,
  socialAuth: (state: ConfigureState) => state.auth.social,
  selectedChain: (state: ConfigureState) => state.access.selectedChain,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
  storageLimit: (state: ConfigureState) => state.store.userLimits.storage,
  bandwidthLimit: (state: ConfigureState) => state.store.userLimits.bandwidth,
  storageRegion: (state: ConfigureState) => state.store.region,
}

const mutations = {
  updateAppId(state: ConfigureState, appId: string) {
    state.appId = appId
  },
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
  updateSelectedTheme(state: ConfigureState, selectedTheme: string) {
    state.selectedTheme = selectedTheme
  },
  updateAggregateLogin(state: ConfigureState, hasAggregateLogin: boolean) {
    state.auth.hasAggregateLogin = hasAggregateLogin
  },
  updateSelectedChain(state: ConfigureState, selectedChain: Chain) {
    state.access.selectedChain = selectedChain
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
  updateStorageRegion(state: ConfigureState, region: StorageRegion) {
    state.store.region = region
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
