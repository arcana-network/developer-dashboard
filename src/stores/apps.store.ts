import { defineStore } from 'pinia'

import {
  createApp,
  fetchAllApps,
  fetchApp,
  getThemeLogo,
} from '@/services/gateway.service'
import calculateUserLimits from '@/utils/calculateUserLimits'
import type { Chain, StorageRegion } from '@/utils/constants'
import { ChainMapping, RegionMapping, WalletMode, api } from '@/utils/constants'

type UserLimitUnit = 'MB' | 'GB'
type UserLimitTarget = 'storage' | 'bandwidth'

type UserLimitState = {
  isUnlimited: boolean
  value?: number
  unit?: UserLimitUnit
}

type UserLimitParam = {
  type: UserLimitTarget
  value: number
  unit: UserLimitUnit
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

type Theme = 'light' | 'dark'

type AppConfig = {
  name: string
  address: string
  logos: {
    dark: {
      horizontal?: string
      vertical?: string
    }
    light: {
      horizontal?: string
      vertical?: string
    }
  }
  access: {
    selectedChain: Chain
  }
  auth: {
    social: SocialAuthState[]
    passwordless: {
      javascriptOrigin?: string
      redirectUri?: string
    }
    wallet: {
      websiteDomain?: string
      selectedTheme: Theme
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

interface AppState {
  appIds: number[]
  appsById: {
    [key: number]: AppConfig
  }
}

const useAppsStore = defineStore('apps', {
  state: (): AppState => ({
    appIds: [],
    appsById: {},
  }),
  getters: {
    apps: (state) => {
      return state.appIds.map((id) => ({ id, ...state.appsById[id] }))
    },
    app: (state) => {
      return (id: number) => state.appsById[id]
    },
  },
  actions: {
    updateApp(appId: number, appDetails: AppConfig) {
      this.appsById[appId] = appDetails
    },
    async addApp(appId: number, appDetails: AppConfig) {
      this.appIds.push(appId)
      this.appsById[appId] = { ...appDetails }
    },
    async fetchAndStoreAllApps() {
      const apps = (await fetchAllApps()).data
      apps.forEach((app) => {
        const appId = app.ID as number
        this.appIds.push(appId)
        this.appsById[appId] = {
          name: app.name as string,
          address: app.address as string,
          auth: {
            social: [],
            passwordless: {
              javascriptOrigin: '',
              redirectUri: '',
            },
            wallet: {
              hasUIMode: app.wallet_type === WalletMode.UI,
              hasUIModeInGateway: app.wallet_type === WalletMode.UI,
              websiteDomain: app.wallet_domain,
              selectedTheme: app.theme as Theme,
            },
            redirectUri: `${api.verify}/${app.ID}/`,
          },
          access: {
            selectedChain: ChainMapping[app.chain] as Chain,
          },
          store: {
            region: RegionMapping[app.region] as StorageRegion,
            userLimits: {
              storage: calculateUserLimits(app.storage_limit),
              bandwidth: calculateUserLimits(app.bandwidth_limit),
            },
          },
          logos: {
            dark: {
              horizontal: app.logo?.dark_horizontal
                ? getThemeLogo('dark', 'horizontal').url
                : '',
              vertical: app.logo?.dark_vertical
                ? getThemeLogo('dark', 'vertical').url
                : '',
            },
            light: {
              horizontal: app.logo?.light_horizontal
                ? getThemeLogo('light', 'horizontal').url
                : '',
              vertical: app.logo?.dark_horizontal
                ? getThemeLogo('light', 'vertical').url
                : '',
            },
          },
        }
      })
    },
    async fetchAndStoreAppConfig(appId: number) {
      const app = (await fetchApp(appId)).data
      const appConfig = this.app(appId)
      appConfig.name = app.name as string
      appConfig.auth.wallet = {
        hasUIMode: app.wallet_type === WalletMode.UI,
        hasUIModeInGateway: app.wallet_type === WalletMode.UI,
        websiteDomain: app.wallet_domain,
        selectedTheme: app.theme as Theme,
      }
      appConfig.auth.redirectUri = `${api.verify}/${app.ID}/`
      appConfig.access.selectedChain = app.chain
        ? (ChainMapping[app.chain] as Chain)
        : 'none'
      appConfig.store = {
        region: RegionMapping[app.region] as StorageRegion,
        userLimits: {
          storage: calculateUserLimits(app.storage_limit),
          bandwidth: calculateUserLimits(app.bandwidth_limit),
        },
      }
      appConfig.logos = {
        dark: {
          horizontal: app.logo?.dark_horizontal
            ? getThemeLogo('dark', 'horizontal').url
            : '',
          vertical: app.logo?.dark_vertical
            ? getThemeLogo('dark', 'vertical').url
            : '',
        },
        light: {
          horizontal: app.logo?.light_horizontal
            ? getThemeLogo('light', 'horizontal').url
            : '',
          vertical: app.logo?.dark_horizontal
            ? getThemeLogo('light', 'vertical').url
            : '',
        },
      }
      if (app.cred?.length) {
        app.cred.forEach((authDetail) => {
          if (authDetail.verifier !== 'passwordless') {
            appConfig.auth.social.push({
              verifier: authDetail.verifier as SocialAuthVerifier,
              clientId: authDetail.clientId,
              clientSecret: authDetail.clientSecret,
              redirectUri: authDetail.redirectURL,
            })
          } else {
            appConfig.auth.passwordless = {
              javascriptOrigin: authDetail.origin || '',
              redirectUri: authDetail.redirectURL || '',
            }
          }
        })
      }
    },
  },
})

export { useAppsStore }

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
  Theme,
  AppConfig,
}
