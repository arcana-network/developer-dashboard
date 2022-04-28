import { createStore, createLogger } from 'vuex'

import authStore from '@/store/auth.store'
import configureStore from '@/store/configure.store'

const debug = process.env.NODE_ENV !== 'production'

const state = {
  env: 'test',
  appName: '',
  appId: null,
  appNameError: false,
  onConfigChange: false,
  isAppConfigured: false,
  smartContractAddress: '',
  showLearnMorePopup: false,
  configDetails: {},
}

const getters = {
  env: (state) => state.env,
  appName: (state) => state.appName,
  appId: (state) => state.appId,
  onConfigChange: (state) => state.onConfigChange,
  isAppConfigured: (state) => state.isAppConfigured,
  smartContractAddress: (state) => state.smartContractAddress,
  showLearnMorePopup: (state) => state.showLearnMorePopup,
  configDetails: (state) => state.configDetails,
  appNameError: (state) => state.appNameError,
}

const mutations = {
  toggleEnv(state) {
    state.env = state.env === 'test' ? 'live' : 'test'
  },
  updateAppName(state, appName) {
    state.appName = appName
  },
  updateAppId(state, appId) {
    state.appId = appId
  },
  configChangeDetected(state) {
    state.onConfigChange = true
  },
  configChangeReset(state) {
    state.onConfigChange = false
  },
  updateAppConfigurationStatus(state, isAppConfigured) {
    state.isAppConfigured = isAppConfigured
  },
  resetStore(state) {
    state.appName = ''
    state.appId = ''
    state.smartContractAddress = ''
  },
  updateSmartContractAddress(state, smartContractAddress) {
    state.smartContractAddress = smartContractAddress
  },
  showLearnMorePopup(state, configDetails) {
    state.showLearnMorePopup = true
    state.configDetails = configDetails
  },
  hideLearnMorePopup(state) {
    state.showLearnMorePopup = false
  },
  updateAppNameError(state, isError) {
    state.appNameError = isError
  },
}

const actions = {
  toggleEnv({ commit }) {
    commit('toggleEnv')
  },
  updateAppName({ commit }, appName) {
    commit('updateAppName', appName)
  },
  updateAppId({ commit }, appId) {
    commit('updateAppId', appId)
  },
  configChangeDetected({ commit }) {
    commit('configChangeDetected')
  },
  configChangeReset({ commit }) {
    commit('configChangeReset')
  },
  updateAppConfigurationStatus({ commit }, isAppConfigured) {
    commit('updateAppConfigurationStatus', isAppConfigured)
  },
  resetStore({ commit }) {
    commit('resetStore')
  },
  updateSmartContractAddress({ commit }, smartContractAddress) {
    commit('updateSmartContractAddress', smartContractAddress)
  },
  showLearnMorePopup({ commit }, configDetails) {
    commit('showLearnMorePopup', configDetails)
  },
  hideLearnMorePopup({ commit }) {
    commit('hideLearnMorePopup')
  },
  updateAppNameError({ commit }, isError) {
    commit('updateAppNameError', isError)
  },
}

const store = createStore({
  modules: {
    test: {
      namespaced: true,
      modules: {
        configureStore,
      },
    },
    live: {
      namespaced: true,
      modules: {
        configureStore,
      },
    },
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
