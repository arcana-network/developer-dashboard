import { defineStore } from 'pinia'

import {
  fetchAllApps,
  fetchApp,
  getNotifications,
  updateNotificationRead,
} from '@/services/gateway.service'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import type {
  Chain,
  Network,
  SocialAuthVerifier,
  WalletUIMode,
} from '@/utils/constants'
import { WalletMode } from '@/utils/constants'
import { createAppConfig } from '@/utils/createAppConfig'

type Notification = {
  data: string
  id: number
  read: boolean
  time: string
  type: string
}

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
  chain_type: string
  chain: number
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
  wallet_mode: WalletUIMode
  session_persisted: boolean
  session_max_age: number
}

type AppState = {
  appIds: AppId[]
  appsById: {
    [key: AppId]: App
  }
  mainnetApps: {
    [key: AppId]: App
  }
  notifications: Array<Notification>
}

const useAppsStore = defineStore('apps', {
  state: (): AppState => ({
    appIds: [],
    appsById: {},
    mainnetApps: {},
    notifications: [],
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
    unreadNotificationCount: ({ notifications }) => {
      return (
        Array.isArray(notifications) &&
        notifications.filter((item) => !item.read).length
      )
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
      const apps = (await fetchAllApps(network)).data || []
      apps.sort(
        (app1, app2) =>
          Date.parse(app2.created_at) - Date.parse(app1.created_at)
      )
      const appConfigPromises: Promise<void>[] = []
      if (network === 'testnet') this.appIds = []
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
      const chainManagementStore = useChainManagementStore()
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
      chainManagementStore.setChainType(
        appId,
        network,
        app.chain_type?.toLowerCase() || 'evm'
      )
    },
    async fetchNotifications() {
      try {
        const { notifications } = (await getNotifications()).data
        this.notifications = notifications
      } catch (e) {
        console.log({ e })
      }
    },
    async updateNotificationReadStatus(list: number[]): Promise<void> {
      try {
        await updateNotificationRead(list)
        this.notifications = this.notifications.map((notification) => {
          if (list.includes(notification.id)) notification.read = true
          return notification
        })
      } catch (e) {
        console.error(e)
      }
    },
  },
})

export { useAppsStore }

export type { SocialAuthState, Theme, App as AppConfig, AppId }
