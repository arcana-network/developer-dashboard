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

async function handleSave() {
  try {
    showWarning.value = false
    loaderStore.showLoader('Saving keyspace preference...')
    await updateApp(app.id, { keyspace: selectedKeyspace.value }, app.network)
    await setKeyspace(app.id, selectedKeyspace.value === 'global')
    app.keyspace = selectedKeyspace.value
    preSelectedKeyspace.value = selectedKeyspace.value
    toast.success('Keyspace preference saved successfully')
  } catch (e) {
    console.error(e)
    toast.error(
      'Error occurred while saving keyspace. Try again or contact support'
    )
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
      <template #title>Keyspace Type</template>
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
            class="learn-more"
          >
            READ MORE
          </a>
        </div>
      </template>
      <VStack gap="1.25rem" wrap>
        <VCard
          variant="depressed"
          class="keyspace-card keyspace-container"
          @click.stop="selectedKeyspace = 'app-specific'"
        >
          <VStack gap="1.25rem" align="start">
            <input
              id="app-specific"
              type="radio"
              :checked="selectedKeyspace === 'app-specific'"
              value="app-specific"
              @change="selectedKeyspace = 'app-specific'"
            />
            <VStack direction="column" gap="10px">
              <span class="card-title">App Specific</span>
              <span class="card-description"
                >App specific keys are more secure than global keys and each
                user has unique wallet address per application.</span
              >
            </VStack>
          </VStack>
        </VCard>
        <div class="position-relative">
          <div
            class="keyspace-card"
            :class="{
              'disabled-card gradient-border-card': app.status !== 2,
            }"
            @click.stop="
              app.status === 2 ? (selectedKeyspace = 'global') : void 0
            "
          >
            <VCard
              variant="depressed"
              class="keyspace-card-global keyspace-container"
            >
              <VStack gap="1.25rem" align="start">
                <input
                  id="global"
                  type="radio"
                  :checked="selectedKeyspace === 'global'"
                  value="global"
                  :disabled="app.status !== 2"
                  @change="selectedKeyspace = 'global'"
                />
                <VStack direction="column" gap="10px">
                  <VStack justify="space-between">
                    <span class="card-title">Global</span>
                    <span
                      v-if="app.status === 0"
                      class="card-description"
                      style="color: #f7f7f7"
                    >
                      *Recommended
                    </span>
                    <VStack v-if="app.status === 1" align="center" gap="4px">
                      <div
                        class="circle-indicator"
                        style="background: #ff6826"
                      ></div>
                      <span class="card-description" style="color: #f7f7f7">
                        In Review
                      </span>
                    </VStack>
                    <VStack v-if="app.status === 2" align="center" gap="4px">
                      <div
                        class="circle-indicator"
                        style="background: #8fff00"
                      ></div>
                      <span class="card-description" style="color: #f7f7f7">
                        Approved
                      </span>
                    </VStack>
                    <VStack v-if="app.status === 3" align="center" gap="4px">
                      <img
                        src="@/assets/iconography/rejected.svg"
                        style="width: 12px"
                      />
                      <span class="card-description" style="color: #f7f7f7">
                        Rejected
                      </span>
                    </VStack>
                  </VStack>
                  <span class="card-description"
                    >Global keys are less secure but simplify user experience,
                    users see the same address across different
                    applications.</span
                  >
                  <VStack
                    class="justify-end"
                    style="margin-top: 2rem; visibility: hidden"
                  >
                    <VButton label="VERIFY" disabled></VButton>
                  </VStack>
                </VStack>
              </VStack>
            </VCard>
          </div>
          <div
            v-if="app.status === 0"
            class="position-absolute"
            style="right: 2rem; bottom: 2rem"
          >
            <VStack class="justify-end" style="margin-top: 2rem">
              <VButton
                label="VERIFY"
                @click.stop="showVerificationForm = true"
              ></VButton>
            </VStack>
          </div>
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

<style scoped>
.keyspace-card {
  width: 100%;
  max-width: 360px;
  cursor: pointer;
}

.circle-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.keyspace-container {
  width: calc(100% - 2rem);
  max-width: 296px;
  padding: 2rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.card-description {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-grey);
}

.gradient-border-card {
  padding: 2px;
  background: linear-gradient(90deg, #cc2b5e 0%, #753a88 100%);
  border-radius: 10px;
}

.disabled-card {
  cursor: not-allowed;
  opacity: 0.4;
}

input[type='radio'] {
  display: grid;
  place-content: center;
  width: 20px;
  background: #313131;
  border-radius: 50%;
  box-shadow: none;
  transform: translateX(0);
  appearance: none;
}

input[type='radio']::before {
  width: 16px;
  height: 16px;
  content: '';
  background: linear-gradient(180deg, #0085ff -4.5%, #29c8fa 100.1%);
  border-radius: 50%;
  transition: 120ms transform ease-in-out;
  transform: scale(0);
}

input[type='radio']:checked::before {
  transform: scale(1);
}
</style>
