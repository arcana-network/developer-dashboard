import { createStore, createLogger } from 'vuex'

import authStore from '@/store/auth.store'
import configureStore from '@/store/configure.store'
import oldConfigureStore from '@/store/old-configure.store'

const debug = process.env.NODE_ENV !== 'production'

const state = {
  env: 'test',
  smartContractAddress: '',
}

const getters = {
  env: (state) => state.env,
  smartContractAddress: (state) => state.smartContractAddress,
}

const mutations = {
  toggleEnv(state) {
    state.env = state.env === 'test' ? 'live' : 'test'
  },
  resetStore(state) {
    state.smartContractAddress = ''
  },
  updateSmartContractAddress(state, smartContractAddress) {
    state.smartContractAddress = smartContractAddress
  },
}

const actions = {
  toggleEnv({ commit }) {
    commit('toggleEnv')
  },
  resetStore({ commit }) {
    commit('resetStore')
  },
  updateSmartContractAddress({ commit }, smartContractAddress) {
    commit('updateSmartContractAddress', smartContractAddress)
  },
}

const store = createStore({
  modules: {
    test: {
      namespaced: true,
      modules: {
        oldConfigureStore,
      },
    },
    live: {
      namespaced: true,
      modules: {
        oldConfigureStore,
      },
    },
    configureStore,
    authStore,
  },
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})

export default store
