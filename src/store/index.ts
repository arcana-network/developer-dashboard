import { createStore, createLogger } from 'vuex'

import authStore from '@/store/auth.store'
import configureStore from '@/store/configure.store'

const debug = process.env.NODE_ENV !== 'production'

type State = {
  smartContractAddress: string
  isLoading: boolean
  loadingMessage: string
  forwarder: string
  rpcUrl: string
}

const state: State = {
  smartContractAddress: '',
  isLoading: false,
  loadingMessage: '',
  forwarder: '',
  rpcUrl: '',
}

const getters = {
  smartContractAddress: (state: State) => state.smartContractAddress,
  isLoading: (state: State) => state.isLoading,
  loadingMessage: (state: State) => state.loadingMessage,
  forwarder: (state: State) => state.forwarder,
  rpcUrl: (state: State) => state.rpcUrl,
}

const mutations = {
  resetStore(state: State) {
    state.smartContractAddress = ''
    state.forwarder = ''
    state.rpcUrl = ''
  },
  updateSmartContractAddress(state: State, smartContractAddress: string) {
    state.smartContractAddress = smartContractAddress
  },
  showLoader(state: State, loadingMessage: string) {
    state.isLoading = true
    state.loadingMessage = loadingMessage
  },
  hideLoader(state: State) {
    state.isLoading = false
  },
  updateForwarder(state: State, forwarder: string) {
    state.forwarder = forwarder
  },
  updateRpcUrl(state: State, rpcUrl: string) {
    state.rpcUrl = rpcUrl
  },
}

const actions = {
  resetStore({ commit }) {
    commit('resetStore')
  },
  updateSmartContractAddress({ commit }, smartContractAddress: string) {
    commit('updateSmartContractAddress', smartContractAddress)
  },
}

const store = createStore({
  modules: {
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
