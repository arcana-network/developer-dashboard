import constants from '@/utils/constants'

const CURRENT_API_VERSION = import.meta.env.VITE_CURRENT_API_VERSION || ''

export default function getEnvApi(
  version: string | boolean = CURRENT_API_VERSION
): string {
  let apiEndpoint = constants.api.testnet

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
