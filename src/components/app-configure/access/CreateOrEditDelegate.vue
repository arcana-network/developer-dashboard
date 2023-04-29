<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

import GenerateKeySuccess from '@/components/app-configure/access/GenerateKeySuccess.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { createDelegate, editDelegate } from '@/services/gateway.service'
import {
  grantDelegate,
  revokeDelegate,
} from '@/services/smart-contract.service'
import {
  type DelegatePermission,
  type DelegateKey,
  type Delegate,
  type DelegateId,
  useAppsStore,
} from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import { generateKey } from '@/utils/generateKey'

const emit = defineEmits(['close', 'success'])

type DelegatePopupProps = {
  variant: 'create' | 'edit'
  delegateInfo?: Delegate
  delegateKeys: DelegateKey[]
}

const props = defineProps<DelegatePopupProps>()

const toast = useToast()
const appId = useAppId()
const loaderStore = useLoaderStore()
const delegateName = ref('')
const selectedDelegateKey = ref({ name: '', address: '' })
const generatedKeyInfo = ref({ privateKey: '' })
const delegateKeysList = ref(props.delegateKeys)
const showGenerateKeySuccess = ref(false)
const appsStore = useAppsStore()

onMounted(() => {
  if (props.variant === 'edit' && props.delegateInfo) {
    delegateName.value = props.delegateInfo.name
    const keyName = delegateKeysList.value.find(
      (key) => key.address === props.delegateInfo?.address
    )?.name
    selectedDelegateKey.value = {
      name: keyName || props.delegateInfo.address,
      address: props.delegateInfo.address,
    }
  }
})

const isFormValid = computed(() => {
  if (props.variant === 'create') {
    return hasNonEmptyInputs()
  }
  return hasNonPreviousValues() && hasNonEmptyInputs()
})

function hasNonEmptyInputs() {
  return delegateName.value !== '' && selectedDelegateKey.value.address !== ''
}

function hasNonPreviousValues() {
  return (
    delegateName.value !== props.delegateInfo?.name ||
    selectedDelegateKey.value.address !== props.delegateInfo.address
  )
}

type DelegatePayload = {
  name: string
  address: string
  permissions: DelegatePermission[]
  id?: DelegateId
}

async function handleSubmit() {
  if (!isFormValid.value) {
    toast.error('Please fill all required values')
    return
  }
  loaderStore.showLoader('Creating Delegate...')
  const keyAddress = selectedDelegateKey.value.address
  const permissions: DelegatePermission[] = ['Download', 'Share and Revoke']
  try {
    const payload: DelegatePayload = {
      name: delegateName.value,
      address: keyAddress,
      permissions,
    }
    if (props.variant === 'edit') {
      payload.id = props.delegateInfo?.id
      return await handleEditDelegate(payload)
    } else {
      return await handleCreateDelegate(payload)
    }
  } catch (err: any) {
    console.error({ err })
    toast.error(err.message)
  } finally {
    loaderStore.hideLoader()
  }
}

async function handleCreateDelegate(payload: DelegatePayload) {
  const { data } = await createDelegate(appId, payload)
  if (data.err) toast.error(data.err)
  else {
    await grantDelegate(appId, payload.address, payload.permissions)
    appsStore.app(appId).access.delegates.push({
      id: data.ID,
      name: data.name,
      address: data.address,
      createdDate: data.CreatedAt,
      permissions: payload.permissions,
    })
    toast.success(`Delegate created`)
    emit('success')
  }
}

async function handleEditDelegate(payload: DelegatePayload) {
  const { data } = await editDelegate(appId, payload)
  if (data.err) toast.error(data.err)
  else {
    if (props.delegateInfo?.address !== payload.address) {
      loaderStore.showLoader('Updating delegate address in smart contract...')
      await revokeDelegate(appId, props.delegateInfo?.address as string)
      await grantDelegate(appId, payload.address, payload.permissions)
    }
    const currentDelegate = appsStore
      .app(appId)
      .access.delegates.find((d) => d.id === payload.id)
    if (currentDelegate) {
      currentDelegate.address = data.address
      currentDelegate.name = data.name
      currentDelegate.permissions = payload.permissions
    }
    toast.success(`Delegate edited`)
    emit('success')
  }
}

function handleKeySelected(option: Delegate) {
  selectedDelegateKey.value = option
}

function handleGenerateKey() {
  const { address, privateKey } = generateKey()
  generatedKeyInfo.value.privateKey = privateKey
  delegateKeysList.value.push({ name: address, address })
  showGenerateKeySuccess.value = true
  selectedDelegateKey.value = { name: address, address }
}
</script>

<template>
  <div v-if="loaderStore.isLoading"></div>
  <div v-else>
    <VOverlay v-if="!showGenerateKeySuccess">
      <div class="center h-full w-full">
        <VCard class="flex column" style="padding: 30px">
          <VStack gap="1rem" direction="column">
            <VStack justify="space-between" align="center">
              <div
                v-if="props.variant === 'create'"
                class="sub-heading-1 title"
              >
                Create A Delegate
              </div>
              <div v-else class="sub-heading-1 title">Edit A Delegate</div>
              <button class="close-button" @click="emit('close')">
                <img src="@/assets/iconography/close.svg" />
              </button>
            </VStack>
            <VSeperator />
            <VStack direction="column" gap="1.5rem">
              <p class="text-lg font-normal description">
                Provide a name, assign a key and set permissions to your
                delegate below
              </p>
              <VStack gap="0.5rem" direction="column">
                <label class="text-lg font-normal label font-semibold"
                  >Name</label
                >
                <VTextField
                  v-model.trim="delegateName"
                  :no-message="true"
                  placeholder="Enter Here"
                />
              </VStack>
              <VStack gap="0.5rem" direction="column">
                <label class="text-lg font-normal label font-semibold"
                  >Key</label
                >
                <VStack gap="1rem">
                  <VDropdown
                    :disabled="props.delegateKeys.length === 0"
                    :options="props.delegateKeys"
                    display-field="name"
                    :model-value="selectedDelegateKey"
                    style="flex: 1"
                    placeholder="Select or Generate"
                    show-tooltip
                    @update:model-value="handleKeySelected"
                  />
                  <VButton
                    label="GENERATE"
                    variant="secondary"
                    @click.stop="handleGenerateKey"
                  />
                </VStack>
                <p class="text-[0.625rem] grey info">
                  Provide a SECP256K1 public key, choose from the list or
                  generate one
                </p>
              </VStack>
              <VStack gap="1rem" direction="column">
                <h3>Permissions Provided to Delegate</h3>
                <VStack gap="1rem">
                  <img src="@/assets/iconography/ok.svg" />
                  <p class="text-base font-medium">Download</p>
                </VStack>
                <VStack gap="1rem">
                  <img src="@/assets/iconography/ok.svg" />
                  <p class="text-base font-medium">Share and Revoke</p>
                </VStack>
              </VStack>
              <VStack gap="1rem" class="popup-footer">
                <VButton
                  label="CANCEL"
                  variant="secondary"
                  @click.stop="emit('close')"
                />
                <VButton
                  label="SUBMIT"
                  :disabled="!isFormValid"
                  @click.stop="handleSubmit"
                />
              </VStack>
            </VStack>
          </VStack>
        </VCard>
      </div>
    </VOverlay>
    <GenerateKeySuccess
      v-else
      :delegate-private-key="generatedKeyInfo.privateKey"
      @proceed="showGenerateKeySuccess = false"
    />
  </div>
</template>

<style scoped>
.grey {
  color: var(--text-grey);
}

.close-button {
  cursor: pointer;
  background-color: transparent;
  border: none;
}

.popup-footer {
  justify-content: end;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
}

.description,
.label {
  max-width: 40ch;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-grey);
}

.info {
  max-width: 28ch;
  font-size: 0.75rem;
  line-height: 1.5;
}
</style>

<style>
.custom-select-value {
  max-width: 12ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-option {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
