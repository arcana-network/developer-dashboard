import type { Chain } from '@/utils/constants'

type ConfigureState = {
  appName: string
  access: {
    selectedChain: Chain
  }
}

const state: ConfigureState = {
  appName: '',
  access: {
    selectedChain: 'ethereum',
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
  updateSelectedChain(state: ConfigureState, selectedChain: Chain) {
    state.access.selectedChain = selectedChain
  },
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
