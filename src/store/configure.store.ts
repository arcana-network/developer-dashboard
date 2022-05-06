type ConfigureState = {
  appName: string
  access: {
    selectedChain: string
  }
}

const state: ConfigureState = {
  appName: '',
  access: {
    selectedChain: '',
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  selectedChain: (state: ConfigureState) => state.access.selectedChain,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
  updateSelectedChain(state: ConfigureState, selectedChain: string) {
    state.access.selectedChain = selectedChain
  },
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
