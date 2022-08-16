<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import type {
  UserLimitParam,
  UserLimitTarget,
  UserLimitUnit,
} from '@/stores/app.store'
import { useAppStore } from '@/stores/app.store'
import {
  userLimitOptions,
  storageValues,
  bandwidthUnits,
  type BandwidthLimitUnit,
} from '@/utils/constants'

type UserLimitKind = 'Unlimited' | 'Limited'

const appStore = useAppStore()

const storageLimitKind = computed(() => {
  return appStore.store.userLimits.storage.isUnlimited ? 'Unlimited' : 'Limited'
})

const bandwidthLimitKind = computed(() => {
  return appStore.store.userLimits.bandwidth.isUnlimited
    ? 'Unlimited'
    : 'Limited'
})

const storageLimit = appStore.store.userLimits.storage
const bandwidthLimit = appStore.store.userLimits.bandwidth

const bandwidthLimitUnit: ComputedRef<BandwidthLimitUnit | undefined> =
  computed(() => {
    if (!appStore.store.userLimits.bandwidth.isUnlimited) {
      return bandwidthUnits.find(
        (bandwidthUnit) =>
          bandwidthUnit.value === appStore.store.userLimits.bandwidth.unit
      )
    } else {
      return undefined
    }
  })

function handleIsUnlimitedChange(type: UserLimitTarget, value: UserLimitKind) {
  const isUnlimited: boolean = value === 'Unlimited' ? true : false
  appStore.toggleUserLimit({ type, isUnlimited })
}

function handleUserLimitFieldChange({ type, unit, value }: UserLimitParam) {
  appStore.updateUserLimit(type, value, unit)
}
</script>

<template>
  <section name="user-limits">
    <SettingCard>
      <template #title>User Limits</template>
      <template #description
        >You can configure the maximum storage and bandwidth consumption limits
        per user. Or you can use the "Unlimited" default.</template
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
              :model-value="storageLimitKind"
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
                  :disabled="storageLimitKind === 'Unlimited'"
                  :model-value="storageLimit.value"
                  no-message
                  class="usage-value-textfield"
                  placeholder="value"
                  @update:model-value="
                    handleUserLimitFieldChange({
                      type: 'storage',
                      value: $event,
                      unit: storageLimit.unit as UserLimitUnit,
                    })
                  "
                />
                <VDropdown
                  :options="storageValues"
                  placeholder="unit"
                  :model-value="storageLimit.unit"
                  class="usage-unit-dropdown"
                  trigger-class="usage-unit-dropdown-trigger"
                  :disabled="storageLimitKind === 'Unlimited'"
                  @update:model-value="
                    handleUserLimitFieldChange({
                      type: 'storage',
                      value: storageLimit.value as number,
                      unit: $event,
                    })
                  "
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
              :model-value="bandwidthLimitKind"
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
                  :disabled="bandwidthLimitKind === 'Unlimited'"
                  :model-value="bandwidthLimit.value"
                  no-message
                  class="usage-value-textfield"
                  placeholder="value"
                  @update:model-value="
                    handleUserLimitFieldChange({
                      type: 'bandwidth',
                      value: $event,
                      unit: bandwidthLimit.unit as UserLimitUnit,
                    })
                  "
                />
                <VDropdown
                  :options="bandwidthUnits"
                  :model-value="bandwidthLimitUnit"
                  display-field="label"
                  placeholder="unit"
                  class="usage-unit-dropdown"
                  trigger-class="usage-unit-dropdown-trigger"
                  :disabled="bandwidthLimitKind === 'Unlimited'"
                  @update:model-value="
                    handleUserLimitFieldChange({
                      type: 'bandwidth',
                      value: bandwidthLimit.value as number,
                      unit: $event.value,
                    })
                  "
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
