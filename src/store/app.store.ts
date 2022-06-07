import bytes from 'bytes'

import {
  type AppConfig,
  fetchAllApps,
  fetchApp,
  getThemeLogo,
} from '@/services/gateway.service'
import {
  defaultUserLimit,
  unlimitedUserLimit,
  ChainMapping,
  RegionMapping,
  WalletMode,
  type Chain,
  type StorageRegion,
  MAX_DATA_TRANSFER_BYTES,
  api,
} from '@/utils/constants'

type UserLimitUnit = 'MB' | 'GB'
type UserLimitTarget = 'storage' | 'bandwidth'

type Logo = {
  mode: 'dark' | 'light'
  orientation: 'horizontal' | 'vertical'
  url: string
}

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

type SocialAuthVerifier =
  | 'google'
  | 'twitter'
  | 'twitch'
  | 'reddit'
  | 'github'
  | 'discord'

type SocialAuthField = 'clientId' | 'clientSecret' | 'redirectUri'

type SocialAuthOption = {
  name: 'Google' | 'Twitter' | 'Twitch' | 'Reddit' | 'Github' | 'Discord'
  verifier: SocialAuthVerifier
  hasClientSecret: boolean
  hasRedirectUri: boolean
  documentation: string
}

type SocialAuthUpdateParam = {
  verifier: SocialAuthVerifier
  field: SocialAuthField
  value: string
}

type SocialAuthState = {
  verifier: SocialAuthVerifier
  clientId?: string
  clientSecret?: string
  redirectUri?: string
}

type AppState = {
  appName: string
  appId: string
  appAddress: string
  logos: {
    dark: {
      horizontal: string
      vertical: string
    }
    light: {
      horizontal: string
      vertical: string
    }
  }
  access: {
    selectedChain: Chain
  }
  auth: {
    social: SocialAuthState[]
    passwordless: {
      javascriptOrigin: string
      redirectUri: string
    }
    wallet: {
      websiteDomain: string
      selectedTheme: 'light' | 'dark'
      hasUIMode: boolean
      hasUIModeInGateway: boolean
    }
    redirectUri: string
  }
  store: {
    userLimits: {
      storage: UserLimitState
      bandwidth: UserLimitState
    }
    region: StorageRegion
  }
}

function getDefaultAppState(): AppState {
  return {
    appName: '',
    appId: '',
    appAddress: '',
    access: {
      selectedChain: 'none',
    },
    logos: {
      dark: {
        horizontal: '',
        vertical: '',
      },
      light: {
        horizontal: '',
        vertical: '',
      },
    },
    auth: {
      social: [],
      passwordless: {
        javascriptOrigin: '',
        redirectUri: '',
      },
      redirectUri: '',
      wallet: {
        websiteDomain: '',
        selectedTheme: 'dark',
        hasUIMode: false,
        hasUIModeInGateway: false,
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
}

const state: AppState = getDefaultAppState()

const getters = {
  appName: (state: AppState) => state.appName,
  appId: (state: AppState) => state.appId,
  appAddress: (state: AppState) => state.appAddress,
  socialAuth: (state: AppState) => state.auth.social,
  walletUIMode: (state: AppState) => state.auth.wallet.hasUIMode,
  walletUIModeInGateway: (state: AppState) =>
    state.auth.wallet.hasUIModeInGateway,
  walletWebsiteDomain: (state: AppState) => state.auth.wallet.websiteDomain,
  selectedTheme: (state: AppState) => state.auth.wallet.selectedTheme,
  selectedChain: (state: AppState) => state.access.selectedChain,
  passwordlessAuth: (state: AppState) => state.auth.passwordless,
  storageLimit: (state: AppState) => state.store.userLimits.storage,
  bandwidthLimit: (state: AppState) => state.store.userLimits.bandwidth,
  storageRegion: (state: AppState) => state.store.region,
  logos: (state: AppState) => state.logos,
  redirectUri: (state: AppState) => state.auth.redirectUri,
  appConfigRequestBody: (state: AppState): AppConfig => {
    let storage_limit: number, bandwidth_limit: number

    const storageLimit = state.store.userLimits.storage
    const bandwidthLimit = state.store.userLimits.bandwidth
    if (storageLimit.isUnlimited) {
      storage_limit = MAX_DATA_TRANSFER_BYTES
    } else {
      storage_limit = bytes(`${storageLimit.value} ${storageLimit.unit}`)
    }

    if (bandwidthLimit.isUnlimited) {
      bandwidth_limit = MAX_DATA_TRANSFER_BYTES
    } else {
      bandwidth_limit = bytes(`${bandwidthLimit.value} ${bandwidthLimit.unit}`)
    }

    const socialAuth = state.auth.social
    const cred: {
      verifier: string
      clientId?: string
      clientSecret?: string
      redirectURL?: string
      origin?: string
    }[] = socialAuth.map((authType) => {
      return {
        verifier: authType.verifier,
        clientId: authType.clientId,
        clientSecret: authType.clientSecret,
        redirectURL: authType.redirectUri,
      }
    })

    if (
      state.auth.passwordless.javascriptOrigin &&
      state.auth.passwordless.redirectUri
    ) {
      cred.push({
        verifier: 'passwordless',
        origin: state.auth.passwordless.javascriptOrigin,
        redirectURL: state.auth.passwordless.redirectUri,
      })
    }

    const wallet_type = state.auth.wallet.hasUIMode
      ? WalletMode.UI
      : WalletMode.NoUI

    return {
      name: state.appName,
      address: state.appAddress,
      storage_limit,
      bandwidth_limit,
      cred,
      aggregate_login: true,
      chain: ChainMapping[state.access.selectedChain],
      region: RegionMapping[state.store.region],
      theme: state.auth.wallet.selectedTheme,
      wallet_domain: state.auth.wallet.websiteDomain,
      wallet_type,
    }
  },
}

const mutations = {
  updateAppId(state: AppState, appId: string) {
    state.appId = appId
  },
  updateAppName(state: AppState, appName: string) {
    state.appName = appName
  },
  updateAppAddress(state: AppState, appAddress: string) {
    state.appAddress = appAddress
  },
  updateSelectedChain(state: AppState, selectedChain: Chain) {
    state.access.selectedChain = selectedChain
  },
  updateSelectedTheme(state: AppState, selectedTheme: 'light' | 'dark') {
    state.auth.wallet.selectedTheme = selectedTheme
  },
  updatePasswordlessAuthJavascriptOrigin(
    state: AppState,
    javascriptOrigin: string
  ) {
    state.auth.passwordless.javascriptOrigin = javascriptOrigin
  },
  updatePasswordlessAuthRedirectUri(state: AppState, redirectUri: string) {
    state.auth.passwordless.redirectUri = redirectUri
  },
  updateUserLimit(
    state: AppState,
    { type, isUnlimited }: UserLimitUnlimitedParam
  ) {
    state.store.userLimits[type] = isUnlimited
      ? { ...unlimitedUserLimit }
      : { ...defaultUserLimit }
  },
  updateUserLimitField(
    state: AppState,
    { type, field, value }: UserLimitParam
  ) {
    state.store.userLimits[type][field] = value
    state.store.userLimits[type].isUnlimited = false
  },
  addSocialAuth(
    state: AppState,
    { verifier, field, value }: SocialAuthUpdateParam
  ) {
    state.auth.social.push({
      verifier,
      [field]: value,
    })
  },
  updateSocialAuth(
    state: AppState,
    { verifier, field, value }: SocialAuthUpdateParam
  ) {
    const exisitingAuth: SocialAuthState | undefined = state.auth.social.find(
      (auth) => auth.verifier === verifier
    )
    if (exisitingAuth) {
      exisitingAuth[field] = value
    }
  },
  removeSocialAuth(state: AppState, verifier: SocialAuthVerifier) {
    state.auth.social = state.auth.social.filter(
      (auth) => auth.verifier !== verifier
    )
  },
  resetSocialAuth(state: AppState) {
    state.auth.social = []
  },
  updateWalletUIMode(state: AppState, hasUIMode: boolean) {
    state.auth.wallet.hasUIMode = hasUIMode
  },
  updateWalletUIModeFromGateway(state: AppState, hasUIModeInGateway: boolean) {
    state.auth.wallet.hasUIModeInGateway = hasUIModeInGateway
  },
  updateWalletWebsiteDomain(state: AppState, websiteDomain: string) {
    state.auth.wallet.websiteDomain = websiteDomain
  },
  updateStorageRegion(state: AppState, region: StorageRegion) {
    state.store.region = region
  },
  updateLogo(state: AppState, { mode, orientation, url }: Logo) {
    state.logos[mode][orientation] = url
  },
  updateRedirectUri(state: AppState, redirectUri: string) {
    state.auth.redirectUri = redirectUri
  },
  resetSettings(state: AppState) {
    const appState = getDefaultAppState()
    state.appName = appState.appName
    state.appId = appState.appId
    state.auth = appState.auth
    state.store = appState.store
    state.access = appState.access
    state.appAddress = appState.appAddress
    state.logos = appState.logos
  },
}

const actions = {
  async fetchAppConfig({ commit }) {
    const apps = await fetchAllApps()
    if (apps.data.length) {
      const currentApp: AppConfig = apps.data[0]
      const app: AppConfig = (await fetchApp(currentApp.ID)).data

      commit('updateAppName', app.name)
      commit('updateAppId', String(currentApp.ID))
      commit('updateAppAddress', app.address)
      commit('updateRedirectUri', `${api.verify}/${currentApp.ID}`)

      const selectedChain = ChainMapping[app.chain]
      commit('updateSelectedChain', selectedChain)

      const storageRegion = RegionMapping[app.region]
      commit('updateStorageRegion', storageRegion)

      const selectedTheme = app.theme
      commit('updateSelectedTheme', selectedTheme)

      if (app.logo?.dark_horizontal) {
        commit('updateLogo', getThemeLogo('dark', 'horizontal'))
      }
      if (app.logo?.light_horizontal) {
        commit('updateLogo', getThemeLogo('light', 'horizontal'))
      }
      if (app.logo?.dark_vertical) {
        commit('updateLogo', getThemeLogo('dark', 'vertical'))
      }
      if (app.logo?.light_vertical) {
        commit('updateLogo', getThemeLogo('light', 'vertical'))
      }

      if (app.cred?.length) {
        app.cred.forEach((authDetail) => {
          if (authDetail.verifier !== 'passwordless') {
            commit('addSocialAuth', {
              verifier: authDetail.verifier,
              field: 'clientId',
              value: authDetail.clientId,
              clientSecret: authDetail.clientSecret,
              redirectUri: authDetail.redirectURL,
            })
            if (authDetail.clientSecret) {
              commit('updateSocialAuth', {
                verifier: authDetail.verifier,
                field: 'clientSecret',
                value: authDetail.clientSecret,
              })
            }
            if (authDetail.redirectUrl) {
              commit('updateSocialAuth', {
                verifier: authDetail.verifier,
                field: 'redirectUri',
                value: authDetail.redirectUrl,
              })
            }
          } else {
            commit('updatePasswordlessAuthJavascriptOrigin', authDetail.origin)
            commit('updatePasswordlessAuthRedirectUri', authDetail.redirectUrl)
          }
        })
      }

      const storageLimit = calculateUserLimits(app.storage_limit)
      if (storageLimit.isUnlimited) {
        commit('updateUserLimit', {
          type: 'storage',
          isUnlimited: true,
        })
      } else {
        commit('updateUserLimitField', {
          type: 'storage',
          field: 'value',
          value: Number(storageLimit.value),
        })
        commit('updateUserLimitField', {
          type: 'storage',
          field: 'unit',
          value: storageLimit.unit,
        })
      }

      const bandwidthLimit = calculateUserLimits(app.bandwidth_limit)
      if (bandwidthLimit.isUnlimited) {
        commit('updateUserLimit', {
          type: 'bandwidth',
          isUnlimited: true,
        })
      } else {
        commit('updateUserLimitField', {
          type: 'bandwidth',
          field: 'value',
          value: Number(bandwidthLimit.value),
        })
        commit('updateUserLimitField', {
          type: 'bandwidth',
          field: 'unit',
          value: bandwidthLimit.unit,
        })
      }

      if (currentApp.wallet_domain) {
        commit('updateWalletWebsiteDomain', currentApp.wallet_domain)
      }

      commit('updateWalletUIMode', currentApp.wallet_type === WalletMode.UI)
      commit(
        'updateWalletUIModeFromGateway',
        currentApp.wallet_type === WalletMode.UI
      )
    }
  },
  resetSettings({ commit }) {
    commit('resetSettings')
  },
}

function calculateUserLimits(userLimit: number) {
  if (userLimit < MAX_DATA_TRANSFER_BYTES) {
    const isUnder1GB = userLimit < bytes('1 GB')

    const calculatedUserLimit = bytes(userLimit, {
      unitSeparator: ' ',
      unit: isUnder1GB ? 'MB' : 'GB',
    })

    const [value, unit] = calculatedUserLimit.split(' ')
    return { value, unit }
  } else {
    return { isUnlimited: true }
  }
}

const configureStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
}

export type {
  UserLimitState,
  UserLimitParam,
  UserLimitTarget,
  UserLimitUnit,
  SocialAuthField,
  SocialAuthState,
  SocialAuthUpdateParam,
  SocialAuthOption,
  SocialAuthVerifier,
}

export default configureStore
