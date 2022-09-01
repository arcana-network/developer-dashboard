import bytes from 'bytes'

import type { UserLimitUnit, UserLimitState } from '@/stores/apps.store'
import { MAX_DATA_TRANSFER_BYTES } from '@/utils/constants'

export default function calculateUserLimits(userLimit: number): UserLimitState {
  if (userLimit < MAX_DATA_TRANSFER_BYTES) {
    const isUnder1GB = userLimit < bytes('1 GB')

    const calculatedUserLimit = bytes(userLimit, {
      unitSeparator: ' ',
      unit: isUnder1GB ? 'MB' : 'GB',
    })

    const [value, unit] = calculatedUserLimit.split(' ') as [
      number,
      UserLimitUnit
    ]
    return { value, unit, isUnlimited: false }
  } else {
    return { isUnlimited: true }
  }
}
