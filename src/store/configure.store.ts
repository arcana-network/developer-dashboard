import type { SocialAuth, Chain, StorageRegion } from '@/utils/constants'

type ConfigureState = {
  appName: string
  isAppConfigured: boolean
  access: {
    selectedChain: Chain
  }
  auth: {
    social: SocialAuth[]
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
  updateSocialAuth(state: ConfigureState, socialAuth: SocialAuth[]) {
    state.auth.social = socialAuth
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

export default configureStore
