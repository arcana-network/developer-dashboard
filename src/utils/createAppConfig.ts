import type { AppConfig as ApiAppResponse } from '@/services/gateway.service'
import { getThemeLogo } from '@/services/gateway.service'
import type { AppConfig } from '@/stores/apps.store'
import type { Network } from '@/utils/constants'
import { ChainMapping, api, type Chain } from '@/utils/constants'

export function createAppConfig(
  app: ApiAppResponse,
  network: Network
): AppConfig {
  return {
    id: app.ID,
    name: app.name as string,
    address: app.address as string,
    totalUsers: 0,
    region: 'asia',
    network,
    logos: {
      dark: {
        horizontal: app.logo?.dark_horizontal
          ? getThemeLogo(app.ID, 'dark', 'horizontal', network).url
          : '',
        vertical: app.logo?.dark_vertical
          ? getThemeLogo(app.ID, 'dark', 'vertical', network).url
          : '',
      },
      light: {
        horizontal: app.logo?.light_horizontal
          ? getThemeLogo(app.ID, 'light', 'horizontal', network).url
          : '',
        vertical: app.logo?.light_vertical
          ? getThemeLogo(app.ID, 'light', 'vertical', network).url
          : '',
      },
    },
    access: {
      selectedChain: app.chain ? (ChainMapping[app.chain] as Chain) : 'none',
    },
    auth: {
      social: [],
      wallet: {
        walletType: app.wallet_type,
        walletTypeInGateway: app.wallet_type,
        websiteDomain: app.wallet_domain,
        selectedTheme: app.theme || 'dark',
      },
      redirectUri: `${api.verify[network]}/${app.ID}/`,
    },
  }
}
