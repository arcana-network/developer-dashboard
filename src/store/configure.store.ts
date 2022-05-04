const state = {
  appName: '',
  appId: null,
  appNameError: false,
  onConfigChange: false,
  isAppConfigured: false,
}

const getters = {
  appName: (state) => state.appName,
  appId: (state) => state.appId,
  onConfigChange: (state) => state.onConfigChange,
  isAppConfigured: (state) => state.isAppConfigured,
  appNameError: (state) => state.appNameError,
}

const mutations = {
  updateAppName(state, appName: string) {
    state.appName = appName
  },
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
