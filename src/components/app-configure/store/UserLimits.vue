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
  bandwidthUnits,
  type UserLimit,
  type UserLimitType,
  type BandwidthLimitUnits,
} from '@/utils/constants'

const store = useStore()
const storageLimitType: ComputedRef<UserLimitType> = computed(() => {
  const storageLimit: UserLimit = store.getters.storageLimit
  if (storageLimit.isUnlimited) {
    return 'Unlimited'
  }
  return 'Limited'
})
const bandwidthLimitType: ComputedRef<UserLimitType> = computed(() => {
  const bandwidthLimit: UserLimit = store.getters.bandwidthLimit
  if (bandwidthLimit.isUnlimited) {
    return 'Unlimited'
  }
  return 'Limited'
})

const storageLimit: ComputedRef<UserLimit> = computed(
  () => store.getters.storageLimit
)
const bandwidthLimit: ComputedRef<UserLimit> = computed(
  () => store.getters.bandwidthLimit
)
const bandwidthLimitUnit: ComputedRef<BandwidthLimitUnits | undefined> =
  computed(() => {
    const tempBandwidthLimit: UserLimit = { ...store.getters.bandwidthLimit }
    if (!tempBandwidthLimit.isUnlimited) {
      return bandwidthUnits.find(
        (bandwidthUnit) => bandwidthUnit.value === tempBandwidthLimit.unit
      )
    } else {
      return undefined
    }
  })

function handleIsUnlimitedChange(
  type: 'storage' | 'bandwidth',
  value: 'Limited' | 'Unlimited'
) {
  const userLimit: UserLimit =
    value === 'Unlimited' ? unlimitedUserLimit : defaultUserLimit
  if (type === 'storage') {
    return store.commit('updateStorageLimit', userLimit)
  }
  return store.commit('updateBandwidthLimit', userLimit)
}
</script>

<template>
  <section name="user-limits">
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
          <VStack gap="1.25rem" wrap class="width-100">
            <VDropdown
              :options="userLimitOptions"
              :model-value="storageLimitType"
              class="limits-type-dropdown"
              trigger-class="limits-type-dropdown-trigger"
              @update:model-value="handleIsUnlimitedChange('storage', $event)"
            />
            <VStack direction="column" class="flex-grow">
              <div class="input-group">
                <VTextField
                  id="storage-user-limit"
                  type="number"
                  min="1"
                  max="1024"
                  :disabled="storageLimitType === 'Unlimited'"
                  :model-value="storageLimit.value"
                  no-message
                  class="usage-value-textfield"
                  placeholder="value"
                />
                <VDropdown
                  :options="storageValues"
                  placeholder="unit"
                  :model-value="storageLimit.unit"
                  class="usage-unit-dropdown"
                  trigger-class="usage-unit-dropdown-trigger"
                  :disabled="storageLimitType === 'Unlimited'"
                />
              </div>
            </VStack>
          </VStack>
        </VStack>
        <VStack direction="column" gap="0.75rem" align="start">
          <h4>Bandwidth</h4>
          <VStack gap="1.25rem" wrap class="width-100">
            <VDropdown
              :options="userLimitOptions"
              :model-value="bandwidthLimitType"
              class="limits-type-dropdown"
              trigger-class="limits-type-dropdown-trigger"
              @update:model-value="handleIsUnlimitedChange('bandwidth', $event)"
            />
            <VStack direction="column" class="flex-grow">
              <div class="input-group">
                <VTextField
                  id="bandwidth-user-limit"
                  type="number"
                  min="1"
                  max="1024"
                  :disabled="bandwidthLimitType === 'Unlimited'"
                  :model-value="bandwidthLimit.value"
                  no-message
                  class="usage-value-textfield"
                  placeholder="value"
                />
                <VDropdown
                  :options="bandwidthUnits"
                  :model-value="bandwidthLimitUnit"
                  display-field="label"
                  placeholder="unit"
                  class="usage-unit-dropdown"
                  trigger-class="usage-unit-dropdown-trigger"
                  :disabled="bandwidthLimitType === 'Unlimited'"
                />
              </div>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
.limits-type-dropdown {
  min-width: 12rem;
}

.input-group {
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
}

.usage-value-textfield {
  width: calc(100% - 10rem);
}

.usage-unit-dropdown {
  min-width: 10rem;
}

@media screen and (min-width: 1024px) {
  .limits-input-container > * {
    flex: 0 0 calc(50% - 1rem);
  }
}
</style>

<style>
.limits-type-dropdown-trigger {
  padding-top: 1.25rem !important;
  padding-bottom: 1.25rem !important;
}

.usage-unit-dropdown-trigger {
  padding-top: 1.25rem !important;
  padding-bottom: 1.25rem !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.usage-value-textfield > * {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>
