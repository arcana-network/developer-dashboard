<script lang="ts" setup>
import { ref, onBeforeMount, type Ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import AppHeader from '@/components/AppHeader.vue'
import DeleteCardConfirmPopup from '@/components/DeleteCardConfirmPopup.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import {
  fetchProfile,
  updateOrganization,
  addCard,
  listCards,
  deleteCard,
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
const cardDetails = ref({
  cardName: '',
  cardNumber: '',
  expiry: '',
  cardId: '',
})
const showDeleteCardModal = ref(false)

const invoiceDetails = ref({
  name: '',
  address: '',
})
const cardName = ref('')
const cardNumberSelected = ref(false)
const cardExpirySelected = ref(false)
const cardCVCSelected = ref(false)

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

onBeforeMount(async () => {
  await fetchProfileData()
  await fetchCardsData()
})

async function fetchProfileData() {
  const profileDetails = (await fetchProfile()).data
  organisationDetails.value = {
    name: profileDetails.organization.name,
    size: profileDetails.organization.size,
    country: profileDetails.organization.country,
  }
  organisationDetailsResetState = { ...organisationDetails.value }
}

async function fetchCardsData() {
  const cards = (await listCards()).data
  if (cards[0]) {
    cardDetails.value = {
      cardName: cards[0].name,
      cardNumber: `XXXX ... ${cards[0].last4}`,
      expiry: `${getMonth(cards[0].exp_month)} / ${cards[0].exp_year}`,
      cardId: cards[0].id,
    }
  }
}

function getMonth(month: number) {
  if (month < 10) {
    return `0${month}`
  } else {
    return `${month}`
  }
}

let stripe: any, cardNumber: any

onMounted(() => {
  if (!cardDetails.value.cardNumber) {
    loadStripe()
  }
})

function loadStripe() {
  stripe = window.Stripe(
    'pk_test_51MN8EKSASugCFwITiKdrNvCht6mwCQdVwLZWv05Gkr5h2ONCVKjiSSA18ig2ear2EfZ6GdSTVllmF3XmjtQIXqIr00eHrjiCpO'
  )
  const elements = stripe.elements()
  const style = {
    base: {
      fontFamily: '"Sora", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      color: '#f7f7f7',
      backgroundColor: 'transparent',
      '::placeholder': {
        color: '#393939',
      },
    },
  }

  cardNumber = elements.create('cardNumber', {
    style,
  })
  cardNumber.mount('#card-number')
  cardNumber.on('focus', () => (cardNumberSelected.value = true))
  cardNumber.on('blur', () => (cardNumberSelected.value = false))

  const cardExpiry = elements.create('cardExpiry', {
    style,
  })
  cardExpiry.mount('#card-expiry')
  cardExpiry.on('focus', () => (cardExpirySelected.value = true))
  cardExpiry.on('blur', () => (cardExpirySelected.value = false))

  const cardCVC = elements.create('cardCvc', {
    style,
  })
  cardCVC.mount('#card-cvc')
  cardCVC.on('focus', () => (cardCVCSelected.value = true))
  cardCVC.on('blur', () => (cardCVCSelected.value = false))
}

function resetOrganisationDetails() {
  editOrganisationDetails.value = false
  organisationDetails.value = { ...organisationDetailsResetState }

  if (organisationDetails.value.sizeErrorMessage) {
    organisationDetails.value.sizeErrorMessage = ''
  }
}

async function submitCard() {
  if (!cardName.value) {
    return toast.error('Your card name is incomplete.')
  }
  loaderStore.showLoader('Adding the card...')
  const { token, error } = await stripe.createToken(cardNumber, {
    name: cardName.value,
  })
  if (token) {
    await addCard(token.id)
    await fetchCardsData()
    toast.success('Card saved successfully')
  } else {
    toast.error(error.message)
  }
  loaderStore.hideLoader()
}

async function handleDeleteProceed() {
  showDeleteCardModal.value = false
  loaderStore.showLoader('Deleting the card...')
  await deleteCard(cardDetails.value.cardId)
  cardDetails.value = {
    cardName: '',
    expiry: '',
    cardNumber: '',
    cardId: '',
  }
  setTimeout(() => {
    loadStripe()
    loaderStore.hideLoader()
  })
}
</script>

<template>
  <div>
    <AppHeader />
    <main :class="{ container: route.name === 'AppProfile' }">
      <VStack class="heading" gap="1.5rem">
        <img
          src="@/assets/iconography/back.svg"
          class="cursor-pointer"
          @click.stop="router.back()"
        />
        <h1>PROFILE</h1>
      </VStack>
      <section class="personal-details">
        <SettingCard>
          <template #title>USER ACCOUNT</template>
          <VStack
            class="flex md-column flex-wrap justify-space-between"
            gap="1.25rem"
          >
            <div class="flex column details flex-grow">
              <label for="light-horizontal-logo">Name</label>
              <VTextField
                v-model.trim="name"
                class="app-name-input"
                disabled
                no-message
              />
            </div>
            <div class="flex column details flex-grow">
              <label for="light-horizontal-logo">Account Identifier</label>
              <VTextField
                v-model.trim="email"
                class="app-name-input"
                disabled
                no-message
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
          <template #title>ORGANISATION</template>
          <form @submit.prevent="onUpdateOrganization">
            <VStack
              class="flex md-column flex-wrap justify-space-between"
              gap="1.25rem"
            >
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Name</label>
                <VTextField
                  v-model.trim="organisationDetails.name"
                  class="app-name-input"
                  no-message
                />
              </div>
              <div class="flex column details flex-grow">
                <label for="light-horizontal-logo">Country</label>
                <VTextField
                  v-model.trim="organisationDetails.country"
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
            </VStack>
            <ConfigureActionButtons
              :save-disabled="false"
              :cancel-disabled="false"
              @cancel="resetOrganisationDetails"
            />
          </form>
        </SettingCard>
      </section>
      <section v-if="false" style="margin-top: 3em">
        <SettingCard>
          <template #title>INVOICING DETAILS</template>
          <form>
            <VStack
              class="flex md-column flex-wrap justify-space-between"
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
              class="flex sm-column flex-wrap justify-space-between payment-container"
              gap="0.5rem"
            >
              <VStack direction="column" class="flex-grow">
                <VStack justify="space-between">
                  <span class="payment-title">Card Details</span>
                  <VButton
                    v-if="cardDetails.cardNumber"
                    variant="link"
                    label="DELETE CARD"
                    @click.stop="showDeleteCardModal = true"
                  />
                </VStack>
                <div class="payment-input">
                  <div class="flex column payment-details-input flex-grow">
                    <label for="card-name">Card Name</label>
                    <VTextField
                      v-if="!cardDetails.cardNumber"
                      id="card-name"
                      v-model.trim="cardName"
                      type="text"
                      placeholder="Name on the card"
                      no-message
                    />
                    <VTextField
                      v-else
                      id="card-name"
                      :model-value="cardDetails.cardName"
                      type="text"
                      disabled
                      no-message
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="card-number">Card Number</label>
                    <div
                      v-if="!cardDetails.cardNumber"
                      class="card-element"
                      :class="{ 'stripe-focused': cardNumberSelected }"
                    >
                      <div id="card-number" style="flex: 1"></div>
                    </div>
                    <VTextField
                      v-else
                      id="card-number"
                      :model-value="cardDetails.cardNumber"
                      type="text"
                      disabled
                      no-message
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label for="card-expiry">Expiry Date</label>
                    <div
                      v-if="!cardDetails.expiry"
                      class="card-element"
                      :class="{ 'stripe-focused': cardExpirySelected }"
                    >
                      <div id="card-expiry" style="flex: 1"></div>
                    </div>
                    <VTextField
                      v-else
                      id="card-expiry"
                      :model-value="cardDetails.expiry"
                      type="text"
                      disabled
                      no-message
                    />
                  </div>
                  <div class="flex column payment-details-input flex-grow">
                    <label v-if="!cardDetails.expiry" for="card-cvc">CVC</label>
                    <div
                      v-if="!cardDetails.expiry"
                      class="card-element"
                      :class="{ 'stripe-focused': cardCVCSelected }"
                    >
                      <div id="card-cvc" style="flex: 1"></div>
                    </div>
                  </div>
                </div>
              </VStack>
            </VStack>
            <ConfigureActionButtons
              :save-disabled="!!cardDetails.cardNumber"
              hide-cancel
              style="margin-top: 3rem"
            />
          </form>
        </SettingCard>
      </section>
      <DeleteCardConfirmPopup
        v-if="showDeleteCardModal"
        @cancel="showDeleteCardModal = false"
        @proceed="handleDeleteProceed"
      />
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
