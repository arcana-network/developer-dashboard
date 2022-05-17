import bytes from 'bytes'

import { fetchAllApps, fetchApp } from '@/services/gateway.service'
import store from '@/store'
import { ChainMapping, RegionMapping, unlimitedBytes } from '@/utils/constants'
import getEnvApi from '@/utils/get-env-api'

type AppResponse = {
  ID: number
  name: string
  address: string
  cred: {
    verifier: string
    clientId?: string
    clientSecret?: string
    redirectURL?: string
    origin?: string
  }[]
  aggregate_login: boolean
  bandwidth_limit: number
  storage_limit: number
  chain: number
  region: number
  theme: string
  wallet_type: number
  logo: {
    dark_horizontal: string
    dark_vertical: string
    light_horizontal: string
    light_vertical: string
  }
}

async function fetchAndStoreAppConfig() {
  const apps = await fetchAllApps()
  if (apps.data.length) {
    const currentApp: AppResponse = apps.data[0]
    const appDetails: AppResponse = (await fetchApp(currentApp.ID)).data

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

function storeBasicAppData(app: AppResponse) {
  store.commit('updateAppName', app.name)
  store.commit('updateAppId', String(app.ID))
  store.commit('updateSmartContractAddress', app.address)
}

function storeSelectedChain(app: AppResponse) {
  const selectedChain = ChainMapping[app.chain]
  store.commit('updateSelectedChain', selectedChain)
}

function storeStorageRegion(app: AppResponse) {
  const storageRegion = RegionMapping[app.region]
  store.commit('updateStorageRegion', storageRegion)
}

function storeSelectedTheme(app: AppResponse) {
  const selectedTheme = app.theme
  store.commit('updateSelectedTheme', selectedTheme)
}

function getThemeLogo(
  mode: 'dark' | 'light',
  orientation: 'horizontal' | 'vertical'
) {
  const logoFetchUrl = `${getEnvApi('v2')}/app/${store.getters.appId}/logo`
  return {
    mode,
    orientation,
    url: `${logoFetchUrl}?type=${mode}&orientation=${orientation}`,
  }
}

function storeThemeLogos(app: AppResponse) {
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

function storeSocialAndPasswordlessAuth(app: AppResponse) {
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
  if (userLimit < unlimitedBytes) {
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
