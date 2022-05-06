import type { SocialAuth } from '@/utils/constants'

type ConfigureState = {
  appName: string
  isAppConfigured: boolean
  auth: {
    social: SocialAuth[]
    passwordless: {
      javascriptOrigin: string
      redirectUri: string
    }
    hasAggregateLogin: boolean
  }
}

const state: ConfigureState = {
  appName: '',
  isAppConfigured: false,
  auth: {
    social: [],
    passwordless: {
      javascriptOrigin: '',
      redirectUri: '',
    },
    hasAggregateLogin: false,
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  isAppConfigured: (state: ConfigureState) => state.isAppConfigured,
  hasAggregateLogin: (state: ConfigureState) => state.auth.hasAggregateLogin,
  socialAuth: (state: ConfigureState) => state.auth.social,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
  updateAggregateLogin(state: ConfigureState, hasAggregateLogin: boolean) {
    state.auth.hasAggregateLogin = hasAggregateLogin
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
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
