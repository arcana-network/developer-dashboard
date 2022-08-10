import { createStore, createLogger } from 'vuex'

import appStore from '@/store/app.store'

const debug = process.env.NODE_ENV !== 'production'

const store = createStore({
  modules: {
    appStore,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})

export default store
