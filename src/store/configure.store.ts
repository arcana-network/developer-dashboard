import type { Chain, UserLimit } from '@/utils/constants'

type ConfigureState = {
  appName: string
  access: {
    selectedChain: Chain
  }
  auth: {
    passwordless: {
      javascriptOrigin: string
      redirectUri: string
    }
  }
  store: {
    userLimits: {
      storage: UserLimit
      bandwidth: UserLimit
    }
  }
}

const state: ConfigureState = {
  appName: '',
  access: {
    selectedChain: 'ethereum',
  },
  auth: {
    passwordless: {
      javascriptOrigin: '',
      redirectUri: '',
    },
  },
  store: {
    userLimits: {
      storage: {
        isUnlimited: true,
        value: 2,
        unit: 'MB',
      },
      bandwidth: {
        isUnlimited: true,
        value: 2,
        unit: 'MB',
      },
    },
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  selectedChain: (state: ConfigureState) => state.access.selectedChain,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
  storageLimits: (state: ConfigureState) => state.store.userLimits.storage,
  bandwidthLimits: (state: ConfigureState) => state.store.userLimits.bandwidth,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
  updateSelectedChain(state: ConfigureState, selectedChain: Chain) {
    state.access.selectedChain = selectedChain
  },
  updatePasswordlessAuthJavascriptOrigin(
    state: ConfigureState,
    javascriptOrigin: string
  ) {
    state.auth.passwordless.javascriptOrigin = javascriptOrigin
  },
  updatePasswordlessAuthRedirectUri(
    state: ConfigureState,
    redirectUri: string
  ) {
    state.auth.passwordless.redirectUri = redirectUri
  },
  updateStorageLimits(state: ConfigureState, limit: UserLimit) {
    state.store.userLimits.storage = limit
  },
  updateBandwidthLimits(state: ConfigureState, limit: UserLimit) {
    state.store.userLimits.bandwidth = limit
  },
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
