<script lang="ts" setup>
import bytes from 'bytes'
import { computed, ref, type ComputedRef, type Ref } from 'vue'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { setDefaultLimit } from '@/services/smart-contract.service'
import type { UserLimitTarget, UserLimitUnit } from '@/stores/apps.store'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import {
  userLimitOptions,
  storageValues,
  bandwidthUnits,
  type BandwidthLimitUnit,
  defaultUserLimit,
  unlimitedUserLimit,
  MAX_DATA_TRANSFER_BYTES,
} from '@/utils/constants'
import { content, errors } from '@/utils/content'

type UserLimitKind = 'Unlimited' | 'Limited'

const MIN_BYTES = bytes('1MB')
const MAX_BYTES = bytes('99GB')

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)
const isEdited = ref(false)

const storageLimit = ref({ ...app.store.userLimits.storage })
const bandwidthLimit = ref({ ...app.store.userLimits.bandwidth })

const storageLimitKind: Ref<UserLimitKind> = ref(
  storageLimit.value.isUnlimited ? 'Unlimited' : 'Limited'
)

const bandwidthLimitKind: Ref<UserLimitKind> = ref(
  bandwidthLimit.value.isUnlimited ? 'Unlimited' : 'Limited'
)

const bandwidthLimitUnit: ComputedRef<BandwidthLimitUnit | undefined> =
  computed(() =>
    bandwidthUnits.find(
      (bandwidthUnit) => bandwidthUnit.value === bandwidthLimit.value.unit
    )
  )

function updateBandwidthUnit(unit: BandwidthLimitUnit) {
  bandwidthLimit.value.unit = unit.value
}

function isLimitValid(type: UserLimitTarget) {
  let limit: {
    isUnlimited: boolean
    value?: number
    unit?: UserLimitUnit
  }
  if (type === 'storage') {
    limit = storageLimit.value
  } else {
    limit = bandwidthLimit.value
  }
  if (limit.isUnlimited) {
    return true
  } else {
    const storageInBytes = bytes(`${limit.value}${limit.unit}`)
    return storageInBytes >= MIN_BYTES && storageInBytes <= MAX_BYTES
  }
}

function handleIsUnlimitedChange(type: UserLimitTarget, value: UserLimitKind) {
  if (value === 'Unlimited') {
    if (type === 'storage') {
      storageLimit.value = { ...unlimitedUserLimit }
    } else {
      bandwidthLimit.value = { ...unlimitedUserLimit }
    }
  } else {
    if (type === 'storage') {
      storageLimit.value = { ...defaultUserLimit }
    } else {
      bandwidthLimit.value = { ...defaultUserLimit }
    }
  }
}

function handleCancel() {
  const { storage, bandwidth } = app.store.userLimits
  storageLimit.value = { ...storage }
  bandwidthLimit.value = { ...bandwidth }
  storageLimitKind.value = storage.isUnlimited ? 'Unlimited' : 'Limited'
  bandwidthLimitKind.value = bandwidth.isUnlimited ? 'Unlimited' : 'Limited'
  isEdited.value = false
}

function convertUserLimits() {
  let storage: number
  let bandwidth: number

  if (storageLimit.value.isUnlimited) {
    storage = MAX_DATA_TRANSFER_BYTES
  } else {
    storage = bytes(`${storageLimit.value.value}${storageLimit.value.unit}`)
  }

  if (bandwidthLimit.value.isUnlimited) {
    bandwidth = MAX_DATA_TRANSFER_BYTES
  } else {
    bandwidth = bytes(
      `${bandwidthLimit.value.value}${bandwidthLimit.value.unit}`
    )
  }

  return { storage, bandwidth }
}

async function handleSave() {
  try {
    loaderStore.showLoader(content.USER_LIMITS.SAVING)
    const store = { ...app.store }
    store.userLimits = {
      storage: { ...storageLimit.value },
      bandwidth: { ...bandwidthLimit.value },
    }
    await updateApp(appId, { store })
    toast.success(content.USER_LIMITS.SUCCESS)
    loaderStore.showLoader(content.USER_LIMITS.SAVING_BLOCKCHAIN)
    const { storage, bandwidth } = convertUserLimits()
    await setDefaultLimit(storage, bandwidth)
    toast.success(content.USER_LIMITS.SAVING_BLOCKCHAIN_SUCCESS)
    app.store.userLimits = store.userLimits
  } catch (e) {
    toast.error(errors.USER_LIMITS.ERROR)
  } finally {
    loaderStore.hideLoader()
    isEdited.value = false
  }
}

function hasSameValuesInStore() {
  const { storage, bandwidth } = app.store.userLimits
  const hasSameStorageValues =
    storage.isUnlimited === storageLimit.value.isUnlimited &&
    storage.value === storageLimit.value.value &&
    storage.unit === storageLimit.value.unit
  const hasSameBandwidthValues =
    bandwidth.isUnlimited === bandwidthLimit.value.isUnlimited &&
    bandwidth.value === bandwidthLimit.value.value &&
    bandwidth.unit === bandwidthLimit.value.unit
  return hasSameStorageValues && hasSameBandwidthValues
}

function isButtonDisabled() {
  return (
    !isLimitValid('storage') ||
    !isLimitValid('bandwidth') ||
    hasSameValuesInStore()
  )
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
      <form @submit.prevent="handleSave">
        <VStack direction="column" gap="2rem" class="flex-1">
          <VStack
            class="limits-input-container"
            md-direction="column"
            gap="2rem"
            wrap
          >
            <VStack
              direction="column"
              gap="0.75rem"
              align="start"
              class="lg:flex-0 lg:flex-none lg:w-calc-half-minus-rem1"
            >
              <h4>Storage</h4>
              <VStack gap="1.25rem" wrap class="w-full">
                <VDropdown
                  v-model="storageLimitKind"
                  :options="userLimitOptions"
                  class="min-w-rem12"
                  trigger-class="limits-type-dropdown-trigger"
                  @update:model-value="
                    handleIsUnlimitedChange('storage', $event)
                  "
                />
                <VStack direction="column" class="flex-1">
                  <div class="flex flex-nowrap justify-between w-full">
                    <VTextField
                      id="storage-user-limit"
                      v-model="storageLimit.value"
                      type="number"
                      min="1"
                      max="1024"
                      :disabled="storageLimitKind === 'Unlimited'"
                      no-message
                      class="w-rem8 rounded-tr-none rounded-br-none"
                      placeholder="value"
                      @blur="isEdited = true"
                    />
                    <VDropdown
                      v-model="storageLimit.unit"
                      :options="storageValues"
                      placeholder="unit"
                      class="min-w-rem10"
                      trigger-class="rounded-tl-none rounded-bl-none"
                      :disabled="storageLimitKind === 'Unlimited'"
                    />
                  </div>
                  <div
                    v-show="isEdited && !isLimitValid('storage')"
                    class="max-w-rem16 my-1.25 mx-5 text-rem0.9 font-normal leading-6 text-system-creamy_red"
                  >
                    Invalid value - Value must be in between 1 MB and 99 GB
                  </div>
                </VStack>
              </VStack>
            </VStack>
            <VStack
              direction="column"
              gap="0.75rem"
              align="start"
              class="lg:flex-0 lg:flex-none lg:w-calc-half-minus-rem1"
            >
              <h4>Bandwidth</h4>
              <VStack gap="1.25rem" wrap class="w-full">
                <VDropdown
                  v-model="bandwidthLimitKind"
                  :options="userLimitOptions"
                  class="min-w-rem12"
                  trigger-class="limits-type-dropdown-trigger"
                  @update:model-value="
                    handleIsUnlimitedChange('bandwidth', $event)
                  "
                />
                <VStack direction="column" class="flex-1">
                  <div class="flex flex-nowrap justify-between w-full">
                    <VTextField
                      id="bandwidth-user-limit"
                      v-model="bandwidthLimit.value"
                      type="number"
                      min="1"
                      max="1024"
                      :disabled="bandwidthLimitKind === 'Unlimited'"
                      no-message
                      class="w-rem8 rounded-tr-none rounded-br-none"
                      placeholder="value"
                      @blur="isEdited = true"
                    />
                    <VDropdown
                      :model-value="bandwidthLimitUnit"
                      :options="bandwidthUnits"
                      display-field="label"
                      placeholder="unit"
                      class="min-w-rem10"
                      trigger-class="rounded-tl-none rounded-bl-none"
                      :disabled="bandwidthLimitKind === 'Unlimited'"
                      @update:model-value="updateBandwidthUnit($event)"
                    />
                  </div>
                  <div
                    v-show="isEdited && !isLimitValid('bandwidth')"
                    class="max-w-rem16 my-1.25 mx-5 text-rem0.9 font-normal leading-6 text-system-creamy_red"
                  >
                    Invalid value - Value must be in between 1 MB and 99 GB
                  </div>
                </VStack>
              </VStack>
            </VStack>
          </VStack>
          <ConfigureActionButtons
            :save-disabled="isButtonDisabled()"
            :cancel-disabled="isButtonDisabled()"
            @cancel="handleCancel"
          />
        </VStack>
      </form>
    </SettingCard>
  </section>
</template>
