interface ConfigureState {
  auth: {
    passwordless: {
      javascriptOrigin: string
      redirectUri: string
    }
  }
}

const state = {
  auth: {
    passwordless: {
      javascriptOrigin: '',
      redirectUri: '',
    },
  },
}

const getters = {
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
}

const mutations = {
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

const actions = {}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
}

export default configureStore
