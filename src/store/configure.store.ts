type ConfigureState = {
  appName: string
  isAppConfigured: boolean
  auth: {
    social: {
      hasAggregateLogin: boolean
    }
    passwordless: {
      javascriptOrigin: string
      redirectUri: string
    }
  }
}

const state: ConfigureState = {
  appName: '',
  isAppConfigured: false,
  auth: {
    social: {
      hasAggregateLogin: false,
    },
    passwordless: {
      javascriptOrigin: '',
      redirectUri: '',
    },
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  isAppConfigured: (state: ConfigureState) => state.isAppConfigured,
  hasAggregateLogin: (state: ConfigureState) =>
    state.auth.social.hasAggregateLogin,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
  updateAggregateLogin(state: ConfigureState, hasAggregateLogin: boolean) {
    state.auth.social.hasAggregateLogin = hasAggregateLogin
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
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
