import type { StorageRegion, Chain } from '@/utils/constants'

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
    region: StorageRegion
  }
}

const state: ConfigureState = {
  appName: '',
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
    region: 'asia',
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  isAppConfigured: (state: ConfigureState) => state.isAppConfigured,
  hasAggregateLogin: (state: ConfigureState) => state.auth.hasAggregateLogin,
  socialAuth: (state: ConfigureState) => state.auth.social,
  selectedChain: (state: ConfigureState) => state.access.selectedChain,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
  storageRegion: (state: ConfigureState) => state.store.region,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
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
  SocialAuthField,
  SocialAuthState,
  SocialAuthUpdateParam,
  SocialAuthOption,
  SocialAuthVerifier,
}

export default configureStore
