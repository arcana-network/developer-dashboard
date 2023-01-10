<script lang="ts" setup>
import { ref, onBeforeMount, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import AppHeader from '@/components/AppHeader.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { fetchProfile, updateOrganization } from '@/services/gateway.service'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'

const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const toast = useToast()
const { logout } = useArcanaAuth()

type OrganizationDetails = {
  name: string
  size: number
  country: string
  sizeErrorMessage?: string
}

const editOrganisationDetails = ref(false)
const organisationDetails: Ref<OrganizationDetails> = ref({
  name: '',
  size: 0,
  sizeErrorMessage: '',
  country: '',
})
const name = ref('')
name.value = authStore.name
const email = ref('')
email.value = authStore.email
const router = useRouter()

let organisationDetailsResetState: OrganizationDetails

async function onUpdateOrganization() {
  const size = Number(organisationDetails.value.size)
  if (!Number.isFinite(size) || !Number.isSafeInteger(size) || size <= 0) {
    organisationDetails.value.sizeErrorMessage = 'Invalid organization size.'
    return
  }
  organisationDetails.value.sizeErrorMessage = ''

  try {
    loaderStore.showLoader('Updating Profile details...')
    await updateOrganization({
      name: organisationDetails.value.name,
      size,
      country: organisationDetails.value.country,
    })
    toast.success('Profile details updated')
    editOrganisationDetails.value = false
    organisationDetailsResetState = { ...organisationDetails.value }
  } catch (e) {
    console.error(e)
    toast.error(
      'An error occurred while saving the profile details. Please try again or contact support'
    )
  } finally {
    loaderStore.hideLoader()
  }
}

onBeforeMount(() => {
  fetchProfile().then((response) => {
    organisationDetails.value = {
      name: response.data.organization.name,
      size: response.data.organization.size,
      country: response.data.organization.country,
    }
    organisationDetailsResetState = { ...organisationDetails.value }
  })
})

async function onLogout() {
  await logout()
  localStorage.clear()
  router.push({ name: 'Login' })
  window.location.reload()
}

function resetOrganisationDetails() {
  editOrganisationDetails.value = false
  organisationDetails.value = { ...organisationDetailsResetState }

  if (organisationDetails.value.sizeErrorMessage) {
    organisationDetails.value.sizeErrorMessage = ''
  }
}
</script>

<template>
  <div>
    <app-header />
    <main class="container">
      <h1 class="heading">PROFILE DETAILS</h1>
      <section class="personal-details">
        <SettingCard>
          <template #title>PERSONAL DETAILS</template>
          <VStack
            class="flex sm-column flex-wrap justify-space-between"
            gap="1.25rem"
          >
            <div class="flex column details flex-grow">
              <label for="light-horizontal-logo">Name</label>
              <VTextField v-model.trim="name" class="app-name-input" disabled />
            </div>
            <div class="flex column details flex-grow">
              <label for="light-horizontal-logo">Public Identifier</label>
              <VTextField
                v-model.trim="email"
                class="app-name-input"
                disabled
              />
            </div>
            <div
              class="flex column details flex-grow"
              style="visibility: hidden"
            ></div>
          </VStack>
        </SettingCard>
      </section>
      <section style="margin-top: 3em">
        <SettingCard>
          <template #title>ORGANISATION DETAILS</template>
          <form>
            <VStack
              class="flex sm-column flex-wrap justify-space-between"
              gap="1.25rem"
            >
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Organisation Name</label>
                <VTextField
                  v-model.trim="organisationDetails.name"
                  class="app-name-input"
                />
              </div>
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Organization Size</label>
                <VTextField
                  v-model.trim="organisationDetails.size"
                  class="app-name-input"
                  type="number"
                />
                <span
                  :style="{
                    visibility: organisationDetails.sizeErrorMessage
                      ? 'visible'
                      : 'hidden',
                  }"
                  class="body-3"
                >
                  {{ organisationDetails.sizeErrorMessage }}
                </span>
              </div>
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Country</label>
                <VTextField
                  v-model.trim="organisationDetails.country"
                  class="app-name-input"
                />
              </div>
            </VStack>
            <ConfigureActionButtons
              :save-disabled="false"
              :cancel-disabled="false"
            />
          </form>
        </SettingCard>
      </section>
      <section style="margin-top: 3em">
        <SettingCard>
          <template #title>INVOICING DETAILS</template>
          <form>
            <VStack
              class="flex sm-column flex-wrap justify-space-between"
              gap="1.25rem"
            >
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Billing Name</label>
                <VTextField
                  v-model.trim="organisationDetails.name"
                  class="app-name-input"
                  :icon="CloseIcon"
                  clickable-icon
                  @icon-clicked="void 0"
                />
              </div>
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Billing Address</label>
                <VTextField
                  v-model.trim="organisationDetails.size"
                  class="app-name-input text-ellipsis"
                  :icon="CloseIcon"
                  clickable-icon
                  @icon-clicked="void 0"
                />
                <span
                  :style="{
                    visibility: organisationDetails.sizeErrorMessage
                      ? 'visible'
                      : 'hidden',
                  }"
                  class="body-3"
                >
                  {{ organisationDetails.sizeErrorMessage }}
                </span>
              </div>
              <div
                class="flex column details flex-grow"
                style="visibility: hidden"
              ></div>
            </VStack>
            <ConfigureActionButtons
              :save-disabled="false"
              :cancel-disabled="false"
            />
          </form>
        </SettingCard>
      </section>
      <section style="margin-top: 3em">
        <SettingCard>
          <template #title>PAYMENT METHODS</template>
          <form>
            <VStack
              align="center"
              md-direction="column"
              class="flex sm-column flex-wrap justify-space-between payment-container"
              gap="10vw"
            >
              <VStack direction="column" gap="1.25rem" class="flex-grow">
                <span class="payment-title">Primary</span>
                <div class="payment-input">
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Card Name</label>
                    <VTextField
                      v-model.trim="organisationDetails.name"
                      class="app-name-input"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="void 0"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Expiry Date</label>
                    <VTextField
                      v-model.trim="organisationDetails.name"
                      class="app-name-input"
                      :icon="CloseIcon"
                      type="number"
                      placeholder="mm-yyyy"
                      clickable-icon
                      no-message
                      pattern="[\d]{2}\/[\d]{4}"
                      @icon-clicked="void 0"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Card Number</label>
                    <VTextField
                      v-model.trim="organisationDetails.name"
                      class="app-name-input"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="void 0"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">CVV Number</label>
                    <VTextField
                      v-model.trim="organisationDetails.name"
                      class="app-name-input cvv"
                      type="number"
                      pattern="[\d]{3}"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="void 0"
                    />
                  </div>
                </div>
              </VStack>
              <div class="switch-icon-container">
                <img
                  src="@/assets/iconography/switch-vertical.svg"
                  class="cursor-pointer switch-icon"
                />
              </div>
              <VStack direction="column" gap="1.25rem" class="flex-grow">
                <VStack
                  justify="space-between"
                  align="center"
                  class="flex-grow"
                >
                  <span class="payment-title">Secondary</span>
                  <VButton variant="link" label="DELETE" />
                </VStack>
                <div class="payment-input">
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Card Name</label>
                    <VTextField
                      v-model.trim="organisationDetails.name"
                      class="app-name-input"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="void 0"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Expiry Date</label>
                    <VTextField
                      v-model.trim="organisationDetails.name"
                      class="app-name-input"
                      type="number"
                      placeholder="mm-yyyy"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="void 0"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Card Number</label>
                    <VTextField
                      v-model.trim="organisationDetails.name"
                      class="app-name-input"
                      no-message
                      :icon="CloseIcon"
                      clickable-icon
                      @icon-clicked="void 0"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">CVV Number</label>
                    <VTextField
                      v-model.trim="organisationDetails.name"
                      class="app-name-input cvv"
                      type="number"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      pattern="[\d]{3}"
                      @icon-clicked="void 0"
                    />
                  </div>
                </div>
              </VStack>
            </VStack>
            <ConfigureActionButtons
              :save-disabled="false"
              :cancel-disabled="false"
            />
          </form>
        </SettingCard>
      </section>
      <div
        class="flex"
        style="justify-content: flex-end; margin-top: 2em; margin-bottom: 2em"
      >
        <v-button
          v-wave="{ color: 'rgb(40, 198, 250)' }"
          variant="secondary"
          label="LOGOUT"
          @click.stop="onLogout"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.details {
  gap: 0.5rem;
  width: 280px;
  margin-top: 1em;
}

.payment-details-input {
  gap: 0.5rem;
  width: 100%;
  margin-top: 1em;
}

.heading {
  margin-top: 2rem;
}

.personal-details {
  margin-top: 3rem;
}

.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

label {
  color: var(--text-grey);
}

.payment-title {
  font-family: var(--font-title);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
}

.switch-icon {
  transition: transform 0.3s;
}

.payment-input {
  display: grid;
  grid-template-columns: 260px 160px;
  gap: 1.25rem;
}

.cvv {
  -webkit-text-security: disc;
}

@media only screen and (max-width: 1023px) {
  .heading {
    margin-top: 0.9em;
    font-size: 1.8em;
  }

  .personal-details {
    margin-top: 2em;
  }

  .switch-icon-container {
    text-align: center;
  }

  .payment-container {
    align-items: stretch;
  }

  .switch-icon {
    transform: rotate(-90deg);
  }

  .payment-input {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.25rem;
  }
}
</style>
