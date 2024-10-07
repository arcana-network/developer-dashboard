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
    <main class="pb-16" :class="{ container: route.name === 'AppProfile' }">
      <VStack class="mt-8 max-lg:mt-em0.9 max-lg:text-em1.8" gap="1rem">
        <img
          src="@/assets/iconography/back.svg"
          class="cursor-pointer w-rem2"
          @click.stop="router.back()"
        />
        <h1>Profile</h1>
      </VStack>
      <section class="mt-12 max-lg:mt-8">
        <SettingCard>
          <template #title>User Account</template>
          <div
            class="flex flex-wrap justify-between space-x-5 max-md:flex-col max-md:space-x-0 max-md:space-y-5"
          >
            <div class="flex flex-col flex-1 space-y-2">
              <label for="light-horizontal-logo" class="text-system-grey"
                >Name</label
              >
              <VTextFieldSecondary
                v-model.trim="name"
                class="app-name-input"
                disabled
                no-message
              />
            </div>
            <div class="flex flex-col flex-1 space-y-2">
              <label for="light-horizontal-logo" class="text-system-grey"
                >Account Identifier</label
              >
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
              class="flex flex-wrap justify-between space-x-5 max-md:flex-col max-md:space-x-0 max-md:space-y-5"
            >
              <div class="flex column flex-1 space-y-2">
                <label for="light-horizontal-logo" class="text-system-grey"
                  >Name</label
                >
                <VTextFieldSecondary
                  v-model.trim="organisationDetails.name"
                  class="app-name-input"
                  no-message
                />
              </div>
              <div class="flex column flex-1 space-y-2">
                <label for="light-horizontal-logo" class="text-system-grey"
                  >Country</label
                >
                <VTextFieldSecondary
                  v-model.trim="organisationDetails.country"
                  class="app-name-input"
                  no-message
                />
              </div>
              <div class="flex column flex-1 space-y-2">
                <label for="light-horizontal-logo" class="text-system-grey"
                  >Organization Size</label
                >
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
    </main>
  </div>
</template>
