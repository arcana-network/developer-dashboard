<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { createDelegate } from '@/services/gateway.service'
import { grantDelegate } from '@/services/smart-contract.service'
import type { DelegatePermission, DelegateKey } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'

const emit = defineEmits(['close', 'generateKey', 'created'])

const props = defineProps({
  delegateKeys: {
    type: Array as PropType<DelegateKey[]>,
    required: true,
  },
})

const loader = ref({
  show: false,
  message: '',
})

const toast = useToast()
const appId = useAppId()
const delegateName = ref('')
const selectedDelegateAddress = ref('')

function showLoader(message: string) {
  loader.value.show = true
  loader.value.message = message
}

function hideLoader() {
  loader.value.show = false
  loader.value.message = ''
}

async function onSubmit() {
  if (delegateName.value === '' || selectedDelegateAddress.value === '') {
    toast.error('Please fill all required values')
    return
  }
  showLoader('Creating Delegate...')
  const keyAddress = selectedDelegateAddress.value
  const permissions: DelegatePermission[] = ['Download', 'Share and Revoke']
  try {
    const payload = {
      name: delegateName.value,
      address: keyAddress,
      permissions,
    }
    const { data } = await createDelegate(appId, payload)
    await grantDelegate(appId, keyAddress, permissions)
    if (data.err) toast.error(data.err)
    else {
      toast.success(`Delegate created with name ${data.name}`)
      emit('created')
      emit('close')
    }
  } catch (err) {
    console.log({ err })
    toast.error(err.message)
  } finally {
    hideLoader()
  }
}

function handleKeySelected(option: string) {
  const { address } = props.delegateKeys.find((item) => item.name == option)
  selectedDelegateAddress.value = address
}
</script>

<template>
  <VOverlay>
    <div class="center height-100 width-100">
      <VCard popup="true" class="flex column" style="padding: 30px">
        <p v-if="loader.show">{{ loader.message }}</p>
        <VStack v-else gap="1rem" direction="column">
          <VStack justify="space-between" align="center">
            <h1 class="sub-heading-5 font-700 text-uppercase">
              Create A Delegate
            </h1>
            <button
              style="
                cursor: pointer;
                background-color: transparent;
                border: none;
              "
              @click="emit('close')"
            >
              <img src="@/assets/iconography/close.svg" />
            </button>
          </VStack>
          <VSeperator />
          <VStack direction="column" gap="1.5rem">
            <p class="body-3 grey">
              Provide a name, assign a key and set permissions to your delegate
              below
            </p>
            <VStack gap="0.5rem" direction="column">
              <label class="body-3 grey">Name</label>
              <VTextField v-model="delegateName" :no-message="true" />
            </VStack>
            <VStack gap="0.5rem" direction="column">
              <label class="body-3 grey">Key</label>
              <VStack gap="1rem">
                <VDropdown
                  :options="props.delegateKeys.map((item) => item.name)"
                  style="flex: 1"
                  trigger-class="text-ellipsis"
                  @update:model-value="handleKeySelected"
                />
                <VButton
                  label="Generate"
                  variant="secondary"
                  @click.stop="emit('generateKey')"
                />
              </VStack>
              <p class="body-3 grey">
                Provide a SECP256K1 public key, choose from the list or generate
                one
              </p>
            </VStack>
            <VStack gap="1rem" direction="column">
              <h3>Permissions Provided to Delegate</h3>
              <VStack gap="1rem">
                <img src="@/assets/iconography/ok.svg" />
                <p class="sub-heading-4 font-500">Download</p>
              </VStack>
              <VStack gap="1rem">
                <img src="@/assets/iconography/ok.svg" />
                <p class="sub-heading-4 font-500">Reshare</p>
              </VStack>
            </VStack>
            <VStack gap="1rem" justify="center">
              <VButton
                label="Cancel"
                variant="secondary"
                @click.stop="emit('close')"
              />
              <VButton label="Submit" @click.stop="onSubmit" />
            </VStack>
          </VStack>
        </VStack>
      </VCard>
    </div>
  </VOverlay>
</template>

<style scoped>
.grey {
  color: var(--text-grey);
}
</style>
