export function truncate(value: string, displayLimit = 4) {
  return (
    value.substring(0, displayLimit) +
    '....' +
    value.substring(value.length - displayLimit)
  )
}
