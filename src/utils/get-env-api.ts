const CURRENT_API_VERSION =
  import.meta.env.VITE_ARCANA_GATEWAY_API_VERSION || ''

export default function getEnvApi(
  version: string | boolean = CURRENT_API_VERSION
): string {
  if (version) {
    return `/api/${version}`
  } else return ''
}
