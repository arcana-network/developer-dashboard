import { defineStore } from 'pinia'

import {
  fetchAllApps,
  fetchApp,
  getThemeLogo,
  fetchAppDelegates,
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
}

type Theme = 'light' | 'dark'

type AppId = number

type WalletModeKind = WalletMode.NoUI | WalletMode.UI

type Delegate = {
  id: number | string
  name: string
  address: string
  permissions: string[]
  createdDate: string
}

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
    delegates: Delegate[]
  }
  auth: {
    social: SocialAuthState[]
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

type AppOverview = {
  id: AppId
  name: string
  bandwidth: {
    allowed: number
    consumed: number
  }
  storage: {
    allowed: number
    consumed: number
  }
  estimatedCost: number
  noOfFiles: number
  totalUsers: number
  createdAt: string
}

type AppState = {
  appIds: AppId[]
  appsById: {
    [key: AppId]: App
  }
  appsOverviewById: {
    [key: AppId]: AppOverview
  }
}

const useAppsStore = defineStore('apps', {
  state: (): AppState => ({
    appIds: [],
    appsById: {},
    appsOverviewById: {},
  }),
  getters: {
    apps: (state) => {
      return state.appIds.map((id) => ({ ...state.appsOverviewById[id] }))
    },
    app: (state) => {
      return (id: AppId) => state.appsById[id]
    },
    appOverview: (state) => {
      return (id: AppId) => state.appsOverviewById[id]
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
    addAppOverview(appId: AppId, overview: AppOverview) {
      this.appsOverviewById[appId] = overview
    },
    deleteApp(appId: AppId) {
      this.appIds = this.appIds.filter((id) => id !== appId)
      delete this.appsById[appId]
    },
    async fetchAndStoreAllApps() {
      this.appIds = []
      const apps = (await fetchAllApps()).data
      apps.sort(
        (app1, app2) =>
          Date.parse(app2.created_at) - Date.parse(app1.created_at)
      )
      const appConfigPromises: Promise<void>[] = []
      apps.forEach((app) => {
        const appId = app.id
        this.appIds.push(appId)
        this.appsOverviewById[app.id] = {
          id: app.id,
          name: app.name,
          bandwidth: {
            allowed: app.bandwidth,
            consumed: app.consumed_bandwidth,
          },
          storage: {
            allowed: app.storage,
            consumed: app.consumed_storage,
          },
          noOfFiles: app.no_of_files,
          totalUsers: app.total_users,
          estimatedCost: app.estimated_cost,
          createdAt: app.created_at,
        }
        appConfigPromises.push(this.fetchAndStoreAppConfig(appId))
      })
      await Promise.all(appConfigPromises)
    },
    async fetchAndStoreAppConfig(appId: AppId) {
      const app = (await fetchApp(appId)).data
      const appDelegates = (await fetchAppDelegates(appId)).data
      const socialAuth: SocialAuthState[] = []
      if (app.cred?.length) {
        app.cred.forEach((authDetail) => {
          socialAuth.push({
            verifier: authDetail.verifier,
            clientId: authDetail.clientId,
            clientSecret: authDetail.clientSecret,
          })
        })
      }
      const delegates: Delegate[] = appDelegates.map((delegate) => {
        const createdDate = delegate.created_at
        const delegateState = {
          ...delegate,
          createdDate,
          created_at: undefined,
        }
        return delegateState
      })
      this.appsById[appId] = {
        id: appId,
        address: app.address,
        name: app.name,
        auth: {
          wallet: {
            walletType: app.wallet_type,
            walletTypeInGateway: app.wallet_type,
            websiteDomain: app.wallet_domain,
            selectedTheme: app.theme || 'dark',
          },
          redirectUri: `${api.verify}/${appId}/`,
          social: socialAuth,
        },
        access: {
          selectedChain: app.chain
            ? (ChainMapping[app.chain] as Chain)
            : 'none',
          delegates,
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
  AppOverview,
  Delegate,
}
