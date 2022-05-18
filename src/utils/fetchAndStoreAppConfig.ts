import bytes from 'bytes'

import {
  fetchAllApps,
  fetchApp,
  getThemeLogo,
  type AppConfig,
} from '@/services/gateway.service'
import store from '@/store'
import {
  ChainMapping,
  MAX_DATA_TRANSFER_BYTES,
  RegionMapping,
} from '@/utils/constants'

async function fetchAndStoreAppConfig() {
  const apps = await fetchAllApps()
  if (apps.data.length) {
    const currentApp: AppConfig = apps.data[0]
    const appDetails: AppConfig = (await fetchApp(currentApp.ID)).data

    storeBasicAppData(currentApp)
    storeSelectedChain(appDetails)
    storeStorageRegion(appDetails)
    storeSelectedTheme(appDetails)
    storeThemeLogos(appDetails)
    storeSocialAndPasswordlessAuth(appDetails)
    storeUserLimits({
      userLimit: appDetails.storage_limit,
      type: 'storage',
    })
    storeUserLimits({
      userLimit: appDetails.bandwidth_limit,
      type: 'bandwidth',
    })
  }
}

function storeBasicAppData(app: AppConfig) {
  store.commit('updateAppName', app.name)
  store.commit('updateAppId', String(app.ID))
  store.commit('updateSmartContractAddress', app.address)
}

function storeSelectedChain(app: AppConfig) {
  const selectedChain = ChainMapping[app.chain]
  store.commit('updateSelectedChain', selectedChain)
}

function storeStorageRegion(app: AppConfig) {
  const storageRegion = RegionMapping[app.region]
  store.commit('updateStorageRegion', storageRegion)
}

function storeSelectedTheme(app: AppConfig) {
  const selectedTheme = app.theme
  store.commit('updateSelectedTheme', selectedTheme)
}

function storeThemeLogos(app: AppConfig) {
  if (app.logo?.dark_horizontal) {
    store.commit('updateLogo', getThemeLogo('dark', 'horizontal'))
  }

  if (app.logo?.light_horizontal) {
    store.commit('updateLogo', getThemeLogo('light', 'horizontal'))
  }

  if (app.logo?.dark_vertical) {
    store.commit('updateLogo', getThemeLogo('dark', 'vertical'))
  }

  if (app.logo?.light_vertical) {
    store.commit('updateLogo', getThemeLogo('light', 'vertical'))
  }
}

function storeSocialAndPasswordlessAuth(app: AppConfig) {
  if (app.cred?.length) {
    app.cred.forEach((authDetail) => {
      if (authDetail.verifier !== 'passwordless') {
        store.commit('addSocialAuth', {
          verifier: authDetail.verifier,
          clientId: authDetail.clientId,
          clientSecret: authDetail.clientSecret,
          redirectUri: authDetail.redirectURL,
        })
      } else {
        store.commit(
          'updatePasswordlessAuthJavascriptOrigin',
          authDetail.origin
        )
        store.commit(
          'updatePasswordlessAuthRedirectUri',
          authDetail.redirectURL
        )
      }
    })
  }
}

function storeUserLimits({
  userLimit,
  type,
}: {
  userLimit: number
  type: 'storage' | 'bandwidth'
}) {
  if (userLimit < MAX_DATA_TRANSFER_BYTES) {
    const isUnder1GB = userLimit < bytes('1 GB')

    const calculatedUserLimit = bytes(userLimit, {
      unitSeparator: ' ',
      unit: isUnder1GB ? 'MB' : 'GB',
    })

    const [value, unit] = calculatedUserLimit.split(' ')
    store.dispatch('updateUserLimitField', {
      type,
      field: 'value',
      value,
    })
    store.dispatch('updateUserLimitField', {
      type,
      field: 'unit',
      value: unit,
    })
  } else {
    store.dispatch('updateUserLimit', {
      type,
      isUnlimited: true,
    })
  }
}

export default fetchAndStoreAppConfig
