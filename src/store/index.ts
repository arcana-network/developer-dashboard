import { createStore, createLogger } from 'vuex'

import appStore from '@/store/app.store'
import authStore from '@/store/auth.store'

const debug = process.env.NODE_ENV !== 'production'

type State = {
  forwarder: string
  rpcUrl: string
}

const state: State = {
  forwarder: '',
  rpcUrl: '',
}

const getters = {
  forwarder: (state: State) => state.forwarder,
  rpcUrl: (state: State) => state.rpcUrl,
}

const mutations = {
  resetStore(state: State) {
    state.forwarder = ''
    state.rpcUrl = ''
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
}

const store = createStore({
  modules: {
    appStore,
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
