import type { Chain, UserLimit, StorageRegion } from '@/utils/constants'

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
    region: StorageRegion
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
      },
      bandwidth: {
        isUnlimited: true,
      },
    },
    region: 'asia',
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  selectedChain: (state: ConfigureState) => state.access.selectedChain,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
  storageLimit: (state: ConfigureState) => state.store.userLimits.storage,
  bandwidthLimit: (state: ConfigureState) => state.store.userLimits.bandwidth,
  storageRegion: (state: ConfigureState) => state.store.region,
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
  updateStorageLimit(state: ConfigureState, limit: UserLimit) {
    state.store.userLimits.storage = limit
  },
  updateBandwidthLimit(state: ConfigureState, limit: UserLimit) {
    state.store.userLimits.bandwidth = limit
  },
  updateStorageRegion(state: ConfigureState, region: StorageRegion) {
    state.store.region = region
  },
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
}

export default configureStore
