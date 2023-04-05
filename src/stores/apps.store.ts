import { defineStore } from 'pinia'

import {
  fetchAllApps,
  fetchApp,
  getNotifications,
  updateNotificationRead,
} from '@/services/gateway.service'
import type { Chain, Network, SocialAuthVerifier } from '@/utils/constants'
import { WalletMode } from '@/utils/constants'
import { createAppConfig } from '@/utils/createAppConfig'

type SocialAuthState = {
  verifier: SocialAuthVerifier
  clientId?: string
  clientSecret?: string
}

type Theme = 'light' | 'dark'

type AppId = number

type WalletModeKind = WalletMode.NoUI | WalletMode.UI

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
  status: 0 | 1 | 2 | 3
  keyspace: 'app-specific' | 'global'
}

type AppState = {
  appIds: AppId[]
  appsById: {
    [key: AppId]: App
  }
  mainnetApps: {
    [key: AppId]: App
  }
  notifications: Array<object>
  latestNotificationId: number | null
}

const useAppsStore = defineStore('apps', {
  state: (): AppState => ({
    appIds: [],
    appsById: {},
    mainnetApps: {},
    notifications: [],
    latestNotificationId: null,
  }),
  getters: {
    apps: (state) => {
      const testnetApps = state.appIds.map((id) => ({ ...state.appsById[id] }))
      const mainnetApps = Object.values(state.mainnetApps).filter(
        (mainnetApp) => !state.appsById[mainnetApp.global_id]
      )
      return [...testnetApps, ...mainnetApps]
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
    getMainnetApp: (state) => {
      const mainnetAppsList = Object.values(state.mainnetApps)
      return (id: AppId) =>
        mainnetAppsList.find((app) => app.global_id === id || app.id === id) ||
        null
    },
    getTestnetApp: (state) => {
      const testnetAppsList = Object.values(state.appsById)
      return (id: AppId) =>
        testnetAppsList.find((app) => app.global_id === id) || null
    },
    areNotificationAvaiable: ({ notifications }) => {
      return Array.isArray(notifications) && notifications.length
    },
    notificationCount: ({ notifications }) => {
      return Array.isArray(notifications) && notifications.length
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
          totalUsers: app.mau || 0,
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
      app.ID = appId
      const configInfo = createAppConfig(app, network)
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
    async fetchNotifications() {
      try {
        const { notification, latest_notification_id } = (
          await getNotifications()
        ).data
        this.notifications = notification
        this.latestNotificationId = latest_notification_id
      } catch (e) {
        console.log({ e })
      }
    },
    async updateNotificationReadStatus(): Promise<void> {
      try {
        await updateNotificationRead(this.latestNotificationId)
      } catch (e) {
        console.error(e)
      }
    },
  },
})

export { useAppsStore }

export type { SocialAuthState, Theme, App as AppConfig, AppId }
