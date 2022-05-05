type ConfigureState = {
  appName: string
  auth: {
    passwordless: {
      javascriptOrigin: string
      redirectUri: string
    }
  }
}

const state: ConfigureState = {
  appName: '',
  auth: {
    passwordless: {
      javascriptOrigin: '',
      redirectUri: '',
    },
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
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
