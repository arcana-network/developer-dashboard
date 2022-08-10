import { createStore, createLogger } from 'vuex'

import appStore from '@/store/app.store'
import authStore from '@/store/auth.store'

const debug = process.env.NODE_ENV !== 'production'

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
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})

export default store
