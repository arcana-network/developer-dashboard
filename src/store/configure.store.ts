type ConfigureState = {
  appName: string
  isAppConfigured: boolean
  auth: {
    social: {
      hasAggregateLogin: boolean
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
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  isAppConfigured: (state: ConfigureState) => state.isAppConfigured,
  hasAggregateLogin: (state: ConfigureState) =>
    state.auth.social.hasAggregateLogin,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
  updateAggregateLogin(state: ConfigureState, hasAggregateLogin: boolean) {
    state.auth.social.hasAggregateLogin = hasAggregateLogin
  },
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
