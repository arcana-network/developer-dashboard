import {
  defaultUserLimit,
  unlimitedUserLimit,
  type Chain,
  type StorageRegion,
} from '@/utils/constants'

type UserLimitUnit = 'MB' | 'GB'
type UserLimitTarget = 'storage' | 'bandwidth'

type UserLimitState =
  | {
      isUnlimited: true
    }
  | {
      isUnlimited: false
      value: number
      unit: UserLimitUnit
    }

type UserLimitParam =
  | {
      type: UserLimitTarget
      field: 'value'
      value: number
    }
  | {
      type: UserLimitTarget
      field: 'unit'
      value: UserLimitUnit
    }

type UserLimitUnlimitedParam = {
  type: UserLimitTarget
  isUnlimited: boolean
}

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
      storage: UserLimitState
      bandwidth: UserLimitState
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
  updateUserLimit(
    state: ConfigureState,
    { type, isUnlimited }: UserLimitUnlimitedParam
  ) {
    state.store.userLimits[type] = isUnlimited
      ? { ...unlimitedUserLimit }
      : { ...defaultUserLimit }
  },
  updateUserLimitField(
    state: ConfigureState,
    { type, field, value }: UserLimitParam
  ) {
    state.store.userLimits[type][field] = value
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

export type { UserLimitState, UserLimitParam, UserLimitTarget, UserLimitUnit }

export default configureStore
