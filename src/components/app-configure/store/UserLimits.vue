<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import {
  userLimitOptions,
  unlimitedUserLimit,
  defaultUserLimit,
  storageValues,
  bandwidthValues,
  type UserLimit,
  type UserLimitType,
} from '@/utils/constants'

const store = useStore()
const storageLimitType: ComputedRef<UserLimitType> = computed(() => {
  const storageLimits: UserLimit = store.getters.storageLimits
  if (storageLimits.isUnlimited) {
    return 'Unlimited'
  }
  return 'Limited'
})
const bandwidthLimitType: ComputedRef<UserLimitType> = computed(() => {
  const bandwidthLimits: UserLimit = store.getters.bandwidthLimits
  if (bandwidthLimits.isUnlimited) {
    return 'Unlimited'
  }
  return 'Limited'
})

function handleIsUnlimitedChange(
  type: 'storage' | 'bandwidth',
  value: 'Limited' | 'Unlimited'
) {
  const userLimit: UserLimit =
    value === 'Unlimited' ? unlimitedUserLimit : defaultUserLimit
  if (type === 'storage') {
    return store.commit('updateStorageLimits', userLimit)
  }
  return store.commit('updateBandwidthLimits', userLimit)
}
</script>

<template>
  <section name="asset-encryption">
    <SettingCard>
      <template #title>User Limits</template>
      <template #description
        >If you would like to limit the bandwidth or storage for each of your
        users, please specify the same below. <a>LEARN MORE</a></template
      >
      <VStack
        class="limits-input-container"
        md-direction="column"
        gap="2rem"
        wrap
      >
        <VStack direction="column" gap="0.75rem" align="start">
          <h4>Storage</h4>
          <VStack gap="1.25rem" wrap>
            <VDropdown
              :options="userLimitOptions"
              :model-value="storageLimitType"
              class="limits-type-dropdown"
              @update:model-value="handleIsUnlimitedChange('storage', $event)"
            />
            <VStack direction="column">
              <div
                class="input-group"
                style="justify-content: space-between; width: 100%"
              >
                <VTextField
                  id="storage-user-limit"
                  type="number"
                  min="1"
                  max="1024"
                  :disabled="storageLimitType === 'Unlimited'"
                  no-message
                />
                <VDropdown
                  :options="storageValues"
                  placeholder="unit"
                  class="usage"
                  style="min-width: 8rem"
                  trigger-style="padding: 18px 20px"
                  :disabled="storageLimitType === 'Unlimited'"
                />
              </div>
              <!-- <span class="error-message" :class="{ show: hasBandwidthError }">
              Value should not be less than 1 MB or more than 99 GB
            </span> -->
            </VStack>
          </VStack>
        </VStack>
        <VStack direction="column" gap="0.75rem" align="start">
          <h4>Bandwidth</h4>
          <VStack gap="1.25rem" wrap>
            <VDropdown
              :options="userLimitOptions"
              :model-value="bandwidthLimitType"
              class="limits-type-dropdown"
              @update:model-value="handleIsUnlimitedChange('bandwidth', $event)"
            />
            <VStack direction="column">
              <div
                class="input-group"
                style="justify-content: space-between; width: 100%"
              >
                <VTextField
                  id="bandwidth-user-limit"
                  type="number"
                  min="1"
                  max="1024"
                  :disabled="bandwidthLimitType === 'Unlimited'"
                  no-message
                />
                <VDropdown
                  :options="bandwidthValues"
                  display-field="label"
                  placeholder="unit"
                  class="usage"
                  style="min-width: 8rem"
                  trigger-style="padding: 18px 20px"
                  :disabled="bandwidthLimitType === 'Unlimited'"
                />
              </div>
              <!-- <span class="error-message" :class="{ show: hasBandwidthError }">
              Value should not be less than 1 MB or more than 99 GB
            </span> -->
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
.limits-type-dropdown {
  min-width: 10rem;
}

.input-group {
  flex-wrap: nowrap;
}

@media screen and (min-width: 1024px) {
  .limits-input-container > * {
    flex: 0 0 calc(50% - 1rem);
  }
}
</style>
