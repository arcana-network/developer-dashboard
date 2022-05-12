<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import type {
  UserLimitParam,
  UserLimitTarget,
  UserLimitUnit,
  UserLimitState,
} from '@/store/configure.store'
import {
  userLimitOptions,
  storageValues,
  bandwidthUnits,
  type BandwidthLimitUnit,
} from '@/utils/constants'

type UserLimitKind = 'Unlimited' | 'Limited'

const store = useStore()

const storageLimitKind: ComputedRef<UserLimitKind> = computed(() => {
  if (store.getters.storageLimit.isUnlimited) {
    return 'Unlimited'
  }
  return 'Limited'
})

const bandwidthLimitKind: ComputedRef<UserLimitKind> = computed(() => {
  if (store.getters.bandwidthLimit.isUnlimited) {
    return 'Unlimited'
  }
  return 'Limited'
})

const storageLimit: ComputedRef<UserLimitState> = computed(
  () => store.getters.storageLimit
)
const bandwidthLimit: ComputedRef<UserLimitState> = computed(
  () => store.getters.bandwidthLimit
)

const bandwidthLimitUnit: ComputedRef<BandwidthLimitUnit | undefined> =
  computed(() => {
    if (!store.getters.bandwidthLimit.isUnlimited) {
      return bandwidthUnits.find(
        (bandwidthUnit) =>
          bandwidthUnit.value === store.getters.bandwidthLimit.unit
      )
    } else {
      return undefined
    }
  })

function handleIsUnlimitedChange(type: UserLimitTarget, value: UserLimitKind) {
  const isUnlimited: boolean = value === 'Unlimited' ? true : false
  return store.commit('updateUserLimit', { type, isUnlimited })
}

function handleUserLimitFieldChange({ type, field, value }: UserLimitParam) {
  return store.commit('updateUserLimitField', { type, field, value })
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
                      field: 'value',
                      value: $event,
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
                      field: 'unit',
                      value: $event,
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
                      field: 'value',
                      value: $event,
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
                      field: 'unit',
                      value: $event.value,
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
