<script lang="ts" setup>
import { ref, onBeforeMount, type Ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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

const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const toast = useToast()

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

const swapClicked = ref(false)

const invoiceDetails = ref({
  name: '',
  address: '',
})

const paymentDetails = reactive({
  primary: {
    cardNumber: '',
    cvv: '',
    expiry: '',
    cardName: '',
  },
  secondary: {
    cardNumber: '',
    cvv: '',
    expiry: '',
    cardName: '',
  },
})
const name = ref(authStore.name)
const email = ref(authStore.email)
const router = useRouter()
const route = useRoute()

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

function resetOrganisationDetails() {
  editOrganisationDetails.value = false
  organisationDetails.value = { ...organisationDetailsResetState }

  if (organisationDetails.value.sizeErrorMessage) {
    organisationDetails.value.sizeErrorMessage = ''
  }
}

function swapCards() {
  const temp = paymentDetails.primary
  paymentDetails.primary = paymentDetails.secondary
  paymentDetails.secondary = temp
  swapClicked.value = !swapClicked.value
}

function deleteSecondary() {
  paymentDetails.secondary = {
    cardNumber: '',
    cvv: '',
    expiry: '',
    cardName: '',
  }
}
</script>

<template>
  <div>
    <AppHeader container />
    <main :class="{ container: route.name === 'AppProfile' }">
      <VStack class="heading" gap="1.5rem">
        <img
          v-if="route.name === 'AppProfile'"
          src="@/assets/iconography/back.svg"
          class="cursor-pointer"
          @click.stop="router.back()"
        />
        <h1>PROFILE DETAILS</h1>
      </VStack>
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
          <form @submit.prevent="onUpdateOrganization">
            <VStack
              class="flex sm-column flex-wrap justify-space-between"
              gap="1.25rem"
            >
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Organisation Name</label>
                <VTextField
                  v-model.trim="organisationDetails.name"
                  class="app-name-input"
                  no-message
                />
              </div>
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Organization Size</label>
                <VTextField
                  v-model.trim="organisationDetails.size"
                  class="app-name-input"
                  type="number"
                  :message="organisationDetails.sizeErrorMessage"
                  :message-type="
                    organisationDetails.sizeErrorMessage ? 'error' : ''
                  "
                />
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
              @cancel="resetOrganisationDetails"
            />
          </form>
        </SettingCard>
      </section>
      <!-- <section style="margin-top: 3em">
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
                  v-model.trim="invoiceDetails.name"
                  class="app-name-input text-ellipsis"
                  :icon="CloseIcon"
                  clickable-icon
                  no-message
                  @icon-clicked="invoiceDetails.name = ''"
                />
              </div>
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Billing Address</label>
                <VTextField
                  v-model.trim="invoiceDetails.address"
                  class="app-name-input text-ellipsis"
                  :icon="CloseIcon"
                  clickable-icon
                  no-message
                  @icon-clicked="invoiceDetails.address = ''"
                />
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
            >
              <VStack direction="column" gap="1.25rem">
                <span class="payment-title">Primary</span>
                <div class="payment-input">
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Card Name</label>
                    <VTextField
                      v-model.trim="paymentDetails.primary.cardName"
                      class="app-name-input text-ellipsis"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="paymentDetails.primary.cardName = ''"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Expiry Date</label>
                    <VTextField
                      v-model.trim="paymentDetails.primary.expiry"
                      class="app-name-input"
                      :icon="CloseIcon"
                      type="number"
                      placeholder="mm/yyyy"
                      clickable-icon
                      no-message
                      pattern="[\d]{2}\/[\d]{4}"
                      @icon-clicked="paymentDetails.primary.expiry = ''"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Card Number</label>
                    <VTextField
                      v-model.trim="paymentDetails.primary.cardNumber"
                      class="app-name-input text-ellipsis"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="paymentDetails.primary.cardNumber = ''"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">CVV</label>
                    <VTextField
                      v-model.trim="paymentDetails.primary.cvv"
                      class="app-name-input cvv"
                      type="number"
                      pattern="[\d]{3}"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="paymentDetails.primary.cvv = ''"
                    />
                  </div>
                </div>
              </VStack>
              <div class="switch-icon-container">
                <img
                  src="@/assets/iconography/switch-vertical.svg"
                  class="cursor-pointer switch-icon"
                  :class="{ swapped: swapClicked }"
                  @click.stop="swapCards"
                />
              </div>
              <VStack direction="column" gap="1.25rem">
                <VStack
                  justify="space-between"
                  align="center"
                  class="flex-grow"
                >
                  <span class="payment-title">Secondary</span>
                  <VButton
                    variant="link"
                    label="DELETE"
                    @click.stop="deleteSecondary"
                  />
                </VStack>
                <div class="payment-input">
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Card Name</label>
                    <VTextField
                      v-model.trim="paymentDetails.secondary.cardName"
                      class="app-name-input text-ellipsis"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      @icon-clicked="paymentDetails.secondary.cardName = ''"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Expiry Date</label>
                    <VTextField
                      v-model.trim="paymentDetails.secondary.expiry"
                      class="app-name-input"
                      type="text"
                      placeholder="mm/yyyy"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      pattern="[\d]{2}\/[\d]{4}"
                      @icon-clicked="paymentDetails.secondary.expiry = ''"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">Card Number</label>
                    <VTextField
                      v-model.trim="paymentDetails.secondary.cardNumber"
                      class="app-name-input text-ellipsis"
                      no-message
                      :icon="CloseIcon"
                      clickable-icon
                      @icon-clicked="paymentDetails.secondary.cardNumber = ''"
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="light-horizontal-logo">CVV</label>
                    <VTextField
                      v-model.trim="paymentDetails.secondary.cvv"
                      class="app-name-input cvv"
                      type="number"
                      :icon="CloseIcon"
                      clickable-icon
                      no-message
                      pattern="[\d]{3}"
                      @icon-clicked="paymentDetails.secondary.cvv = ''"
                    />
                  </div>
                </div>
              </VStack>
            </VStack>
            <ConfigureActionButtons
              :save-disabled="false"
              :cancel-disabled="false"
              style="margin-top: 3rem"
            />
          </form>
        </SettingCard>
      </section> -->
    </main>
  </div>
</template>

<style scoped>
.details {
  gap: 0.5rem;
  width: 280px;
  margin-top: 1em;
}

main {
  padding-bottom: 4rem;
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
  grid-template-columns: 18vw 10vw;
  gap: 1.25rem;
}

.cvv {
  -webkit-text-security: disc;
}

.swapped {
  transform: rotate(-180deg);
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
    gap: 2rem;
    align-items: stretch;
  }

  .switch-icon {
    transform: rotate(-90deg);
  }

  .swapped {
    transform: rotate(-270deg);
  }

  .payment-input {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
