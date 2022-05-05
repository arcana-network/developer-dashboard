type ConfigureState = {
  appName: string
}

const state: ConfigureState = {
  appName: '',
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
