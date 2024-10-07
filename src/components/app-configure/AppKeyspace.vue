<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import SwitchKeyspacePopup from '@/components/app-configure/SwitchKeyspacePopup.vue'
import VerificationForm from '@/components/app-configure/VerificationForm.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { setKeyspace } from '@/services/smart-contract.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { WalletUIModes } from '@/utils/constants'
import { content, errors } from '@/utils/content'

const showVerificationForm = ref(false)
const route = useRoute()
const appId = Number(route.params.appId)
const appsStore = useAppsStore()
const app = appsStore.app(appId)
const selectedKeyspace = ref(app.keyspace)
let preSelectedKeyspace = ref(app.keyspace)
const loaderStore = useLoaderStore()
const toast = useToast()
const showWarning = ref(false)
const CUSTOM_UI = 'Custom UI'

const chosenWalletUIMode = WalletUIModes.find(
  (mode) => mode.value === app.wallet_mode
)?.label

async function handleSave() {
  try {
    showWarning.value = false
    loaderStore.showLoader(content.KEYSPACE.SAVING)
    await updateApp(app.id, { keyspace: selectedKeyspace.value }, app.network)
    await setKeyspace(app.id, selectedKeyspace.value === 'global')
    app.keyspace = selectedKeyspace.value
    preSelectedKeyspace.value = selectedKeyspace.value
    toast.success(content.KEYSPACE.SUCCESS)
  } catch (e) {
    console.error(e)
    toast.error(errors.KEYSPACE_ERROR)
  } finally {
    loaderStore.hideLoader()
  }
}

function handleSubmitted() {
  showVerificationForm.value = false
  app.status = 1
}

function handleCancel() {
  showWarning.value = false
  selectedKeyspace.value = preSelectedKeyspace.value
}
</script>

<template>
  <section name="app-branding">
    <SettingCard class="app-branding-card">
      <template #title><h1>Keyspace Type</h1></template>
      <template #description>
        <div>
          Choose between app-specific (default, highly secure) or global
          keyspace for your app. Enabling global keyspace requires an extra
          verification step during app registration. Global keyspace provides a
          better user experience as the app users are assigned the same keys
          (wallet address) across all apps in the Arcana ecosystem. Changing
          keyspace type after app deployment will affect user experience as the
          keys are reassigned causing a change in user's wallet address.
          <a
            href="https://docs.dev.arcana.network/concepts/sharedkeys.html"
            target="_blank"
          >
            READ MORE
          </a>
        </div>
      </template>
      <VStack gap="1.25rem" wrap>
        <VCard
          variant="depressed"
          class="w-full max-w-px360 cursor-pointer max-w-px296 p-8 bg-black_solid-default"
          @click.stop="selectedKeyspace = 'app-specific'"
        >
          <VStack direction="column" gap="1.25rem" align="start">
            <input
              id="app-specific"
              type="radio"
              :checked="selectedKeyspace === 'app-specific'"
              value="app-specific"
              class="grid place-content-center w-px20 h-px20 bg-white_solid-default border-2 border-black_solid-default rounded-full appearance-none shadow-none before:content-[''] before:w-4 before:h-4 before:bg-black_solid-default before:border-2 before:border-white_solid-default before:rounded-full before:appearance-none before:transition-transform before:duration-120 before:transform before:scale-0 before:ease-in-out checked:before:scale-100"
              @change="selectedKeyspace = 'app-specific'"
            />
            <VStack direction="column" gap="10px">
              <span class="text-base font-semibold">App Specific</span>
              <span class="w-full text-xs leading-6 text-black_solid-default"
                >Users will be assigned
                <span class="font-extrabold">a Wallet Address</span> that is
                unique to your app. Since the user's keys are specific to your
                app, they are not exposed to any malicious apps or transaction
                requests.</span
              >
            </VStack>
          </VStack>
        </VCard>
        <div v-if="chosenWalletUIMode !== CUSTOM_UI" class="relative">
          <VCard
            variant="depressed"
            class="keyspace-card-global max-w-px296 p-8 bg-black_solid-default"
            @click.stop="selectedKeyspace = 'global'"
          >
            <VStack gap="1.25rem" align="start" direction="column">
              <input
                id="global"
                type="radio"
                :checked="selectedKeyspace === 'global'"
                value="global"
                class="grid place-content-center w-px20 h-px20 bg-white_solid-default border-2 border-black_solid-default rounded-full appearance-none shadow-none before:content-[''] before:w-4 before:h-4 before:bg-black_solid-default before:border-2 before:border-white_solid-default before:rounded-full before:appearance-none before:transition-transform before:duration-120 before:transform before:scale-0 before:ease-in-out checked:before:scale-100"
                @change="selectedKeyspace = 'global'"
              />
              <VStack direction="column" gap="10px">
                <VStack justify="space-between">
                  <span class="text-base font-semibold">Global</span>
                </VStack>
                <span class="w-full text-xs leading-6 text-black_solid-default"
                  >Users will be assigned
                  <span class="font-extrabold">the same wallet address</span>
                  across all apps with Arcana Auth. This improves user
                  experience but users have to ensure they do not sign malicious
                  transactions on a fraudulent app. Arcana mitigates this risk
                  with an app review and validation process before approving the
                  global keys feature for an app.</span
                >
                <VStack class="justify-end mt-8 invisible">
                  <VButton label="VERIFY" disabled></VButton>
                </VStack>
              </VStack>
            </VStack>
          </VCard>
        </div>
      </VStack>
      <ConfigureActionButtons
        :save-disabled="selectedKeyspace === preSelectedKeyspace"
        :cancel-disabled="selectedKeyspace === preSelectedKeyspace"
        @cancel="selectedKeyspace = preSelectedKeyspace"
        @save="showWarning = true"
      />
    </SettingCard>
    <VerificationForm
      v-if="showVerificationForm"
      :app-id="appId"
      :address="app.address"
      @submitted="handleSubmitted"
      @close="showVerificationForm = false"
    />
    <SwitchKeyspacePopup
      v-if="showWarning"
      @switch="handleSave"
      @cancel="handleCancel"
    />
  </section>
</template>
