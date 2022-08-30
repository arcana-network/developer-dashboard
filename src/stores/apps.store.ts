import { defineStore } from 'pinia'

import {
  fetchAllApps,
  fetchApp,
  getThemeLogo,
} from '@/services/gateway.service'
import calculateUserLimits from '@/utils/calculateUserLimits'
import type {
  Chain,
  StorageRegion,
  SocialAuthVerifier,
} from '@/utils/constants'
import { ChainMapping, RegionMapping, WalletMode, api } from '@/utils/constants'

type UserLimitUnit = 'MB' | 'GB'
type UserLimitTarget = 'storage' | 'bandwidth'

type UserLimitState = {
  isUnlimited: boolean
  value?: number
  unit?: UserLimitUnit
}

type SocialAuthState = {
  verifier: SocialAuthVerifier
  clientId?: string
  clientSecret?: string
  redirectUri?: string
}

type Theme = 'light' | 'dark'

type PasswordlessAuth = {
  javascriptOrigin?: string
  redirectUri?: string
}

type AppId = number

type WalletModeKind = WalletMode.NoUI | WalletMode.UI

type App = {
  id: AppId
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
    passwordless: PasswordlessAuth
    wallet: {
      websiteDomain?: string
      selectedTheme: Theme
      walletType: WalletModeKind
      walletTypeInGateway: WalletModeKind
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

type AppState = {
  appIds: AppId[]
  appsById: {
    [key: AppId]: App
  }
}

const useAppsStore = defineStore('apps', {
  state: (): AppState => ({
    appIds: [],
    appsById: {},
  }),
  getters: {
    apps: (state) => {
      return state.appIds.map((id) => ({ ...state.appsById[id] }))
    },
    app: (state) => {
      return (id: AppId) => state.appsById[id]
    },
    hasUiMode: (state) => {
      return (id: AppId) =>
        state.appsById[id].auth.wallet.walletType === WalletMode.UI
    },
    hasUiModeInGateway: (state) => {
      return (id: AppId) =>
        state.appsById[id].auth.wallet.walletTypeInGateway === WalletMode.UI
    },
  },
  actions: {
    updateApp(appId: AppId, appDetails: App) {
      this.appsById[appId] = appDetails
    },
    addApp(appId: AppId, appDetails: App) {
      this.appIds.unshift(appId)
      this.appsById[appId] = { ...appDetails }
    },
    deleteApp(appId: AppId) {
      this.appIds = this.appIds.filter((id) => id !== appId)
      delete this.appsById[appId]
    },
    async fetchAndStoreAllApps() {
      const apps = (await fetchAllApps()).data
      apps.sort(
        (app1, app2) => Date.parse(app2.CreatedAt) - Date.parse(app1.CreatedAt)
      )
      const appConfigPromises: Promise<void>[] = []
      apps.forEach((app) => {
        const appId = app.ID
        this.appIds.push(appId)
        appConfigPromises.push(this.fetchAndStoreAppConfig(appId))
      })
      await Promise.all(appConfigPromises)
    },
    async fetchAndStoreAppConfig(appId: AppId) {
      const app = (await fetchApp(appId)).data
      const socialAuth: SocialAuthState[] = []
      const passwordlessAuth: PasswordlessAuth = {}
      if (app.cred?.length) {
        app.cred.forEach((authDetail) => {
          if (authDetail.verifier !== 'passwordless') {
            socialAuth.push({
              verifier: authDetail.verifier,
              clientId: authDetail.clientId,
              clientSecret: authDetail.clientSecret,
              redirectUri: authDetail.redirectURL,
            })
          } else {
            passwordlessAuth.javascriptOrigin = authDetail.origin || ''
            passwordlessAuth.redirectUri = authDetail.redirectURL || ''
          }
        })
      }
      this.appsById[appId] = {
        id: appId,
        address: app.address,
        name: app.name,
        auth: {
          wallet: {
            walletType: app.wallet_type,
            walletTypeInGateway: app.wallet_type,
            websiteDomain: app.wallet_domain,
            selectedTheme: app.theme,
          },
          redirectUri: `${api.verify}/${app.ID}/`,
          social: socialAuth,
          passwordless: passwordlessAuth,
        },
        access: {
          selectedChain: app.chain
            ? (ChainMapping[app.chain] as Chain)
            : 'none',
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
              ? getThemeLogo(appId, 'dark', 'horizontal').url
              : '',
            vertical: app.logo?.dark_vertical
              ? getThemeLogo(appId, 'dark', 'vertical').url
              : '',
          },
          light: {
            horizontal: app.logo?.light_horizontal
              ? getThemeLogo(appId, 'light', 'horizontal').url
              : '',
            vertical: app.logo?.light_vertical
              ? getThemeLogo(appId, 'light', 'vertical').url
              : '',
          },
        },
      }
    },
  },
})

export { useAppsStore }

export type {
  UserLimitState,
  UserLimitTarget,
  UserLimitUnit,
  SocialAuthState,
  Theme,
  App as AppConfig,
  AppId,
}
