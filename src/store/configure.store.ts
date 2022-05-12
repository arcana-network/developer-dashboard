import type { Chain, StorageRegion } from '@/utils/constants'

type ConfigureState = {
  appName: string
  selectedTheme: string
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
    region: StorageRegion
  }
}

const state: ConfigureState = {
  appName: '',
  selectedTheme: 'light',
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
    region: 'asia',
  },
}

const getters = {
  appName: (state: ConfigureState) => state.appName,
  selectedTheme: (state: ConfigureState) => state.selectedTheme,
  selectedChain: (state: ConfigureState) => state.access.selectedChain,
  passwordlessAuth: (state: ConfigureState) => state.auth.passwordless,
  storageRegion: (state: ConfigureState) => state.store.region,
}

const mutations = {
  updateAppName(state: ConfigureState, appName: string) {
    state.appName = appName
  },
  updateSelectedTheme(state: ConfigureState, selectedTheme: string) {
    state.selectedTheme = selectedTheme
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
