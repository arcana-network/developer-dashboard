import bytes from 'bytes'
import { defineStore } from 'pinia'

import {
  type AppConfig,
  fetchAllApps,
  fetchApp,
  getThemeLogo,
} from '@/services/gateway.service'
import calculateUserLimits from '@/utils/calculateUserLimits'
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

type UserLimitState = {
  isUnlimited: boolean
  value?: number
  unit?: UserLimitUnit
}

type UserLimitUnlimitedParam = {
  type: UserLimitTarget
  isUnlimited: boolean
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

interface AppState {
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

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
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
  }),
  actions: {
    updateAppId(appId: string) {
      this.appId = appId
    },
    updateAppName(appName: string) {
      this.appName = appName
    },
    updateAppAddress(appAddress: string) {
      this.appAddress = appAddress
    },
    updateSelectedChain(selectedChain: Chain) {
      this.access.selectedChain = selectedChain
    },
    updateSelectedTheme(selectedTheme: 'light' | 'dark') {
      this.auth.wallet.selectedTheme = selectedTheme
    },
    updatePasswordlessAuthJavascriptOrigin(javascriptOrigin: string) {
      this.auth.passwordless.javascriptOrigin = javascriptOrigin
    },
    updatePasswordlessAuthRedirectUri(redirectUri: string) {
      this.auth.passwordless.redirectUri = redirectUri
    },
    toggleUserLimit({ type, isUnlimited }: UserLimitUnlimitedParam) {
      this.store.userLimits[type] = isUnlimited
        ? { ...unlimitedUserLimit }
        : { ...defaultUserLimit }
    },
    updateUserLimit(
      type: 'storage' | 'bandwidth',
      value: number,
      unit: UserLimitUnit
    ) {
      this.store.userLimits[type] = {
        isUnlimited: false,
        unit,
        value,
      }
    },
    addSocialAuth({ verifier, field, value }: SocialAuthUpdateParam) {
      this.auth.social.push({
        verifier,
        [field]: value,
      })
    },
    updateSocialAuth({ verifier, field, value }: SocialAuthUpdateParam) {
      const exisitingAuth: SocialAuthState | undefined = this.auth.social.find(
        (auth) => auth.verifier === verifier
      )
      if (exisitingAuth) {
        exisitingAuth[field] = value
      }
    },
    removeSocialAuth(verifier: SocialAuthVerifier) {
      this.auth.social = this.auth.social.filter(
        (auth) => auth.verifier !== verifier
      )
    },
    updateWalletUIMode(hasUIMode: boolean) {
      this.auth.wallet.hasUIMode = hasUIMode
    },
    updateWalletUIModeFromGateway(hasUIModeInGateway: boolean) {
      this.auth.wallet.hasUIModeInGateway = hasUIModeInGateway
    },
    updateWalletWebsiteDomain(websiteDomain: string) {
      this.auth.wallet.websiteDomain = websiteDomain
    },
    updateStorageRegion(region: StorageRegion) {
      this.store.region = region
    },
    updateLogo({ mode, orientation, url }: Logo) {
      this.logos[mode][orientation] = url
    },
    updateRedirectUri(redirectUri: string) {
      this.auth.redirectUri = redirectUri
    },
    async fetchAppConfig() {
      const apps = await fetchAllApps()
      if (apps.data.length) {
        const currentApp: AppConfig = apps.data[0]
        const app: AppConfig = (await fetchApp(currentApp.ID)).data

        this.appName = app.name || ''
        this.appId = String(currentApp.ID)
        this.appAddress = app.address || ''
        this.auth.redirectUri = `${api.verify}/${currentApp.ID}/`
        this.access.selectedChain = ChainMapping[app.chain] as Chain
        this.store.region = RegionMapping[app.region] as StorageRegion
        this.auth.wallet.selectedTheme = app.theme as Theme

        if (app.logo?.dark_horizontal) {
          this.logos.dark.horizontal = getThemeLogo('dark', 'horizontal').url
        }
        if (app.logo?.light_horizontal) {
          this.logos.light.horizontal = getThemeLogo('light', 'horizontal').url
        }
        if (app.logo?.dark_vertical) {
          this.logos.dark.vertical = getThemeLogo('dark', 'vertical').url
        }
        if (app.logo?.light_vertical) {
          this.logos.light.vertical = getThemeLogo('light', 'vertical').url
        }

        if (app.cred?.length) {
          app.cred.forEach((authDetail) => {
            if (authDetail.verifier !== 'passwordless') {
              this.auth.social.push({
                verifier: authDetail.verifier as SocialAuthVerifier,
                clientId: authDetail.clientId,
                clientSecret: authDetail.clientSecret,
                redirectUri: authDetail.redirectURL,
              })
            } else {
              this.auth.passwordless = {
                javascriptOrigin: authDetail.origin || '',
                redirectUri: authDetail.redirectURL || '',
              }
            }
          })
        }

        this.store.userLimits.storage = calculateUserLimits(app.storage_limit)
        this.store.userLimits.bandwidth = calculateUserLimits(
          app.bandwidth_limit
        )
        this.auth.wallet.websiteDomain = currentApp.wallet_domain || ''
        this.auth.wallet.hasUIMode = currentApp.wallet_type === WalletMode.UI
        this.auth.wallet.hasUIModeInGateway =
          currentApp.wallet_type === WalletMode.UI
      }
    },
  },
})

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
}
