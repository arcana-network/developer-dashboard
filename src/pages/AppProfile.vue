<script lang="ts" setup>
import { ref, onBeforeMount, type Ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import AppHeader from '@/components/AppHeader.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import {
  fetchProfile,
  updateOrganization,
  addCard,
  listCards,
} from '@/services/gateway.service'
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
const cardName = ref('')

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
  listCards()
})

let stripe: any, card: any

onMounted(() => {
  stripe = window.Stripe(
    'pk_test_51MN8EKSASugCFwITiKdrNvCht6mwCQdVwLZWv05Gkr5h2ONCVKjiSSA18ig2ear2EfZ6GdSTVllmF3XmjtQIXqIr00eHrjiCpO'
  )
  const elements = stripe.elements()
  const style = {
    base: {
      fontFamily: 'Sora, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '1rem',
      color: '#f7f7f7',
      backgroundColor: 'transparent',
      '::placeholder': {
        color: '#8d8d8d',
      },
    },
  }

  card = elements.create('card', { style, hidePostalCode: true })

  card.mount('#card-element')
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

async function submitCard() {
  loaderStore.showLoader('Adding a payment method...')
  const { token, error } = await stripe.createToken(card, {
    name: cardName.value,
  })
  if (token) {
    console.log(token)
    await addCard(token.id)
    loaderStore.hideLoader()
  } else {
    toast.error(error.message)
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
                  v-model.trim="invoiceDetails.name"
                  class="app-name-input"
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
                  class="app-name-input"
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
          <form @submit.prevent="submitCard">
            <VStack
              class="flex sm-column flex-wrap justify-space-between"
              gap="1.25rem"
            >
              <div class="flex column details flex-grow">
                <label for="card-element">
                  Enter credit or debit card details
                </label>
                <VStack class="card-element" align="center" gap="1rem">
                  <input
                    v-model.trim="cardName"
                    type="text"
                    placeholder="Name on the card"
                    class="card-name"
                  />
                  <div id="card-element" style="flex-grow: 1"></div>
                </VStack>
              </div>
            </VStack>
            <ConfigureActionButtons
              :save-disabled="false"
              :cancel-disabled="false"
              style="margin-top: 3rem"
            />
          </form>
        </SettingCard>
      </section>
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
  font-size: 14px;
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

  .details {
    width: unset;
  }
}
</style>
