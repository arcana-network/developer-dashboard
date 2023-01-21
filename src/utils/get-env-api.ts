import constants, { type Network } from '@/utils/constants'

const CURRENT_API_VERSION =
  import.meta.env.VITE_ARCANA_GATEWAY_API_VERSION || ''

export default function getEnvApi(
  version: string | boolean = CURRENT_API_VERSION,
  network: Network = 'testnet'
): string {
  let apiEndpoint = constants.api.gateway[network]

  if (version === false) {
    return apiEndpoint
  }

  if (version) {
    version = '/' + version
  }

  if (!apiEndpoint.endsWith('/')) {
    apiEndpoint += '/'
  }
  return apiEndpoint + 'api' + version
}
