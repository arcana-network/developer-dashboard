<script lang="ts" setup>
import { ref, onBeforeMount, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import AppHeader from '@/components/AppHeader.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextFieldSecondary from '@/components/lib/VTextFieldSecondary/VTextFieldSecondary.vue'
import { useToast } from '@/components/lib/VToast'
import {
  fetchProfile,
  updateOrganization,
  updateBillingAddress,
  getBillingAddress,
} from '@/services/gateway.service'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'
import { content, errors } from '@/utils/content'

const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const toast = useToast()

type OrganizationDetails = {
  name: string
  size: number
  country: string
  sizeErrorMessage?: string
}

const organisationDetails: Ref<OrganizationDetails> = ref({
  name: '',
  size: 0,
  sizeErrorMessage: '',
  country: '',
})
let organisationDetailsCopy = {
  name: '',
  size: 0,
  country: '',
}

const invoiceDetails = ref({
  name: '',
  address: '',
})
const billingDetails = ref({
  addressLine1: '',
  addressLine2: '',
  country: '',
  zipCode: '',
  state: '',
  city: '',
  isPresentInServer: false,
})
let billingDetailsCopy = {
  addressLine1: '',
  addressLine2: '',
  country: '',
  zipCode: '',
  state: '',
  city: '',
  isPresentInServer: false,
}

const name = ref(authStore.name)
const email = ref(authStore.email)
const router = useRouter()
const route = useRoute()

async function onUpdateOrganization() {
  const size = Number(organisationDetails.value.size)
  if (!Number.isFinite(size) || !Number.isSafeInteger(size) || size <= 0) {
    organisationDetails.value.sizeErrorMessage = 'Invalid organization size.'
    return
  }
  organisationDetails.value.sizeErrorMessage = ''

  try {
    loaderStore.showLoader(content.GENERIC.UPDATING)
    await updateOrganization({
      name: organisationDetails.value.name,
      size,
      country: organisationDetails.value.country,
    })
    toast.success(content.GENERIC.UPDATED)
    organisationDetailsCopy = {
      name: organisationDetails.value.name,
      size,
      country: organisationDetails.value.country,
    }
    organisationDetails.value = { ...organisationDetailsCopy }
  } catch (e) {
    console.error(e)
    toast.error(errors.GENERIC.ERROR)
  } finally {
    loaderStore.hideLoader()
  }
}

onBeforeMount(async () => {
  await fetchProfileData()
  await getBillingDetails()
})

async function getBillingDetails() {
  const billingAddress = (await getBillingAddress()).data
  billingDetailsCopy = {
    city: billingAddress.city,
    country: billingAddress.country,
    addressLine1: billingAddress.line1,
    addressLine2: billingAddress.line2,
    zipCode: billingAddress.postal_code,
    state: billingAddress.state,
    isPresentInServer: true,
  }
  billingDetailsCopy.isPresentInServer = hasBillingAddress(billingDetailsCopy)
  billingDetails.value = { ...billingDetailsCopy }
}

async function fetchProfileData() {
  const profileDetails = (await fetchProfile()).data
  organisationDetailsCopy = {
    name: profileDetails.organization.name,
    size: profileDetails.organization.size,
    country: profileDetails.organization.country,
  }
  organisationDetails.value = { ...organisationDetailsCopy }
}

function resetOrganisationDetails() {
  organisationDetails.value = { ...organisationDetailsCopy }

  if (organisationDetails.value.sizeErrorMessage) {
    organisationDetails.value.sizeErrorMessage = ''
  }
}

async function updateBillingDetails() {
  if (!billingDetails.value.addressLine1) {
    return toast.error(content.BILLING.DETAILS.ADDRESS)
  }
  if (!billingDetails.value.city) {
    return toast.error(content.BILLING.DETAILS.CITY)
  }
  if (!billingDetails.value.state) {
    return toast.error(content.BILLING.DETAILS.STATE)
  }
  if (!billingDetails.value.zipCode) {
    return toast.error(content.BILLING.DETAILS.ZIP)
  }
  if (
    billingDetails.value.zipCode.length < 4 ||
    billingDetails.value.zipCode.length > 10
  ) {
    return toast.error(content.BILLING.DETAILS.INVALID_ZIP)
  }
  if (!billingDetails.value.zipCode) {
    return toast.error(content.BILLING.DETAILS.COUNTRY)
  }
  loaderStore.showLoader(content.BILLING.DETAILS.SAVING)
  await updateBillingAddress({
    city: billingDetails.value.city,
    country: billingDetails.value.country,
    line1: billingDetails.value.addressLine1,
    line2: billingDetails.value.addressLine2,
    postalCode: billingDetails.value.zipCode,
    state: billingDetails.value.state,
  })
  billingDetailsCopy = {
    city: billingDetails.value.city,
    country: billingDetails.value.country,
    addressLine1: billingDetails.value.addressLine1,
    addressLine2: billingDetails.value.addressLine2,
    zipCode: billingDetails.value.zipCode,
    state: billingDetails.value.state,
    isPresentInServer: true,
  }
  billingDetails.value = { ...billingDetailsCopy }
  loaderStore.hideLoader()

  toast.success(content.BILLING.DETAILS.SAVED)
}

function hasBillingAddress(details?: typeof billingDetailsCopy) {
  const data = details || billingDetails.value
  const isNotEmpty =
    !!data.addressLine1 &&
    !!data.city &&
    !!data.country &&
    !!data.zipCode &&
    !!data.state

  return isNotEmpty
}

function hasOrganisationDetails() {
  const isNotEmpty =
    !!organisationDetails.value.name &&
    !!organisationDetails.value.country &&
    !!organisationDetails.value.size

  return isNotEmpty
}

function isOrganisationDetailsSame() {
  return (
    organisationDetails.value.name === organisationDetailsCopy.name &&
    organisationDetails.value.country === organisationDetailsCopy.country &&
    organisationDetails.value.size === organisationDetailsCopy.size
  )
}

function isBillingCopySame() {
  const billingKeys = Object.keys(billingDetails.value)
  const isEvery = billingKeys.every(
    (key) => billingDetails.value[key] === billingDetailsCopy[key]
  )
  return isEvery
}

function handleCancel() {
  const billingKeys = Object.keys(billingDetails.value)
  billingKeys.forEach(
    (key) => (billingDetails.value[key] = billingDetailsCopy[key])
  )
}
</script>

<template>
  <div>
    <AppHeader />
    <main :class="{ container: route.name === 'AppProfile' }">
      <VStack class="heading" gap="1rem">
        <img
          src="@/assets/iconography/back.svg"
          class="cursor-pointer"
          @click.stop="router.back()"
        />
        <h1>Profile</h1>
      </VStack>
      <section class="personal-details">
        <SettingCard>
          <template #title>User Account</template>
          <div
            class="flex flex-wrap justify-between space-x-5 max-[768px]:flex-col max-[768px]:space-x-0 max-[768px]:space-y-5"
          >
            <div class="flex flex-col flex-1 space-y-2">
              <label for="light-horizontal-logo">Name</label>
              <VTextFieldSecondary
                v-model.trim="name"
                class="app-name-input"
                disabled
                no-message
              />
            </div>
            <div class="flex flex-col flex-1 space-y-2">
              <label for="light-horizontal-logo">Account Identifier</label>
              <VTextFieldSecondary
                v-model.trim="email"
                class="app-name-input"
                disabled
                no-message
              />
            </div>
          </div>
        </SettingCard>
      </section>
      <section class="mt-12">
        <SettingCard>
          <template #title>Organisation</template>
          <form @submit.prevent="onUpdateOrganization">
            <div
              class="flex flex-wrap justify-between space-x-5 max-[768px]:flex-col max-[768px]:space-x-0 max-[768px]:space-y-5"
            >
              <div class="flex column flex-1 space-y-2">
                <label for="light-horizontal-logo">Name</label>
                <VTextFieldSecondary
                  v-model.trim="organisationDetails.name"
                  class="app-name-input"
                  no-message
                />
              </div>
              <div class="flex column flex-1 space-y-2">
                <label for="light-horizontal-logo">Country</label>
                <VTextFieldSecondary
                  v-model.trim="organisationDetails.country"
                  class="app-name-input"
                  no-message
                />
              </div>
              <div class="flex column flex-1 space-y-2">
                <label for="light-horizontal-logo">Organization Size</label>
                <VTextFieldSecondary
                  v-model.trim="organisationDetails.size"
                  class="app-name-input"
                  type="number"
                  :message="organisationDetails.sizeErrorMessage"
                  :message-type="
                    organisationDetails.sizeErrorMessage ? 'error' : ''
                  "
                />
              </div>
            </div>
            <ConfigureActionButtons
              :save-disabled="
                isOrganisationDetailsSame() || !hasOrganisationDetails()
              "
              :cancel-disabled="isOrganisationDetailsSame()"
              @cancel="resetOrganisationDetails"
            />
          </form>
        </SettingCard>
      </section>
      <!-- <section id="billing-details" class="mt-12">
        <SettingCard>
          <template #title>Billing Address Details</template>
          <form @submit.prevent="updateBillingDetails">
            <VStack
              v-if="false"
              class="flex flex-col flex-wrap justify-between"
              gap="1.25rem"
            >
              <div class="flex column flex-1 space-y-2">
                <label for="light-horizontal-logo">Billing Name</label>
                <VTextFieldSecondary
                  v-model.trim="invoiceDetails.name"
                  class="app-name-input"
                  :icon="CloseIcon"
                  clickable-icon
                  @icon-clicked="invoiceDetails.name = ''"
                />
              </div>
              <div class="flex column flex-1 space-y-2">
                <label for="light-horizontal-logo">Billing Address</label>
                <VTextFieldSecondary
                  v-model.trim="invoiceDetails.address"
                  class="app-name-input"
                  :icon="CloseIcon"
                  clickable-icon
                  @icon-clicked="invoiceDetails.address = ''"
                />
              </div>
              <div class="flex column flex-1 invisible"></div>
            </VStack>
            <div class="flex column flex-1 space-y-4">
              <div
                class="flex flex-wrap justify-between space-x-5 max-[768px]:flex-col max-[768px]:space-x-0 max-[768px]:space-y-5"
              >
                <div class="flex flex-col flex-1 space-y-2">
                  <label for="billing-address-line-1">Address Line 1</label>
                  <VTextFieldSecondary
                    id="billing-address-line-1"
                    v-model.trim="billingDetails.addressLine1"
                    class="app-name-input"
                    no-message
                  />
                </div>
                <div class="flex flex-col flex-1 space-y-2">
                  <label for="billing-address-line-2"
                    >Address Line 2 (Optional)</label
                  >
                  <VTextFieldSecondary
                    id="billing-address-line-2"
                    v-model.trim="billingDetails.addressLine2"
                    class="app-name-input"
                    no-message
                  />
                </div>
              </div>
              <div
                class="flex flex-wrap justify-between space-x-5 max-[768px]:flex-col max-[768px]:space-x-0 max-[768px]:space-y-5"
              >
                <div class="flex column flex-1 space-y-2">
                  <label for="billing-city">City</label>
                  <VTextFieldSecondary
                    id="billing-city"
                    v-model.trim="billingDetails.city"
                    no-message
                  />
                </div>
                <div class="flex column flex-1 space-y-2">
                  <label for="billing-state">State</label>
                  <VTextFieldSecondary
                    id="billing-state"
                    v-model.trim="billingDetails.state"
                    no-message
                  />
                </div>
                <div class="flex column flex-1 space-y-2">
                  <label for="billing-zipcode">Zip Code</label>
                  <VTextFieldSecondary
                    id="billing-zipcode"
                    v-model.trim="billingDetails.zipCode"
                    type="number"
                    no-message
                  />
                </div>
                <div class="flex column flex-1 space-y-2">
                  <label for="billing-country">Country</label>
                  <VTextFieldSecondary
                    id="billing-country"
                    v-model.trim="billingDetails.country"
                  />
                </div>
              </div>
            </div>
            <ConfigureActionButtons
              :save-disabled="isBillingCopySame() || !hasBillingAddress()"
              :cancel-disabled="isBillingCopySame()"
              @cancel="handleCancel"
            />
          </form>
        </SettingCard>
      </section> -->
    </main>
  </div>
</template>

<style scoped>
main {
  padding-bottom: 4rem;
}

.card-element {
  padding: 1rem;
  background: linear-gradient(141.48deg, #161616 -4.56%, #151515 135.63%);
  border-radius: 10px;
  box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
}

.card-name {
  width: 30%;
  font-family: Sora, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #f7f7f7;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  -webkit-font-smoothing: antialiased;
}

.card-name::placeholder {
  color: #8d8d8d;
}

.payment-details-input {
  gap: 0.5rem;
  width: 100%;
  margin-top: 1em;
}

.heading {
  margin-top: 2rem;
}

.heading img {
  width: 2rem;
}

.personal-details {
  margin-top: 3rem;
}

label {
  color: var(--text-grey);
}

.payment-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
}

.switch-icon {
  transition: transform 0.3s;
}

.payment-input {
  display: grid;
  grid-template-columns: 24vw 20vw 10rem 10rem;
  gap: 1.5rem;
}

.cvv {
  -webkit-text-security: disc;
}

.swapped {
  transform: rotate(-180deg);
}

.stripe-focused {
  outline: 1px solid var(--primary);
}

.billing-details {
  display: flex;
}

.payment-form {
  position: relative;
}

.hide-payment-form::before {
  position: absolute;
  inset: -2rem -1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  content: 'Enter the billing address details to access payment methods.';
  background: rgb(10 10 10 / 70%);
  backdrop-filter: blur(16px);
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

  .details {
    width: unset;
  }
}
</style>
