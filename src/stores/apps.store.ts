import { defineStore } from 'pinia'

import {
  fetchAllApps,
  fetchApp,
  fetchAppDelegates,
} from '@/services/gateway.service'
import type { Chain, Network, SocialAuthVerifier } from '@/utils/constants'
import { WalletMode } from '@/utils/constants'
import { createAppConfig } from '@/utils/createAppConfig'

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

type DelegatePermission = 'Download' | 'Share and Revoke'
type DelegateOperation = 'create' | 'edit'
type DelegateId = number | string
type DelegateKey = { name: string; address: string }

type Delegate = {
  id: DelegateId
  name: string
  address: string
  permissions: DelegatePermission[]
  createdDate: string
}

type App = {
  id: AppId
  name: string
  address: string
  totalUsers: number
  createdAt: string
  region: string
  network: Network
  global_id: AppId
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
}

type AppState = {
  appIds: AppId[]
  appsById: {
    [key: AppId]: App
  }
  mainnetApps: {
    [key: AppId]: App
  }
}

const useAppsStore = defineStore('apps', {
  state: (): AppState => ({
    appIds: [],
    appsById: {},
    mainnetApps: {},
  }),
  getters: {
    apps: (state) => {
      return state.appIds.map((id) => ({ ...state.appsById[id] }))
    },
    app: (state) => {
      return (id: AppId) => {
        return state.mainnetApps[id] || state.appsById[id] || null
      }
    },
    hasUiMode: (state) => {
      return (id: AppId) =>
        state.appsById[id].auth.wallet.walletType === WalletMode.UI
    },
    hasUiModeInGateway: (state) => {
      return (id: AppId) =>
        state.appsById[id].auth.wallet.walletTypeInGateway === WalletMode.UI
    },
    appNetwork: (): Network => {
      return 'testnet'
    },
    getMainnetApp: (state) => {
      const mainnetAppsList = Object.values(state.mainnetApps)
      return (id: AppId) =>
        mainnetAppsList.find((app) => app.global_id === id) || null
    },
    getTestnetApp: (state) => {
      const testnetAppsList = Object.values(state.appsById)
      return (id: AppId) =>
        testnetAppsList.find((app) => app.global_id === id) || null
    },
  },
  actions: {
    updateApp(appId: AppId, appDetails: App, network: Network) {
      if (network === 'mainnet') this.mainnetApps[appId] = appDetails
      else this.appsById[appId] = appDetails
    },
    addApp(appId: AppId, appDetails: App, network: Network) {
      if (network === 'mainnet') this.mainnetApps[appId] = appDetails
      else {
        this.appIds.unshift(appId)
        this.appsById[appId] = { ...appDetails }
      }
    },
    deleteApp(appId: AppId, network: Network) {
      if (network === 'mainnet') delete this.mainnetApps[appId]
      else {
        this.appIds = this.appIds.filter((id) => id !== appId)
        delete this.appsById[appId]
      }
    },
    async fetchAndStoreAllApps(network: Network) {
      if (network === 'testnet') this.appIds = []
      const apps = (await fetchAllApps(network)).data || []
      apps.sort(
        (app1, app2) =>
          Date.parse(app2.created_at) - Date.parse(app1.created_at)
      )
      const appConfigPromises: Promise<void>[] = []
      apps.forEach((app) => {
        const appInfo = {
          id: app.id,
          name: app.name,
          totalUsers: app.total_users,
          createdAt: app.created_at,
          global_id: app.global_id,
        }
        if (network === 'mainnet') {
          this.mainnetApps[appInfo.id] = {
            ...appInfo,
            network,
          }
        } else {
          this.appIds.push(app.id)
          this.appsById[app.id] = {
            ...appInfo,
            network,
          }
        }
        appConfigPromises.push(this.fetchAndStoreAppConfig(app.id, network))
      })
      await Promise.all(appConfigPromises)
    },
    async fetchAndStoreAppConfig(appId: AppId, network: Network) {
      const app = (await fetchApp(appId, network)).data
      const appDelegates = (await fetchAppDelegates(appId, network)).data || []
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
      app.ID = appId
      const configInfo = createAppConfig(app, network)
      configInfo.access.delegates = delegates
      if (network === 'mainnet') {
        this.mainnetApps[appId] = {
          ...this.mainnetApps[appId],
          ...configInfo,
        }
      } else {
        this.appsById[appId] = {
          ...this.appsById[appId],
          ...configInfo,
        }
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
  Delegate,
  DelegatePermission,
  DelegateId,
  DelegateOperation,
  DelegateKey,
}
