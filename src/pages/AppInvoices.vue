<script lang="ts" setup>
import { ref } from 'vue'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import AppHeader from '@/components/AppHeader.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'

const authStore = useAuthStore()
const loaderStore = useLoaderStore()
const toast = useToast()

const expandInvoice = ref('')
const expandCardOptions = ref(false)

const invoices = [
  {
    month: 'MAY',
    year: 2023,
    amount: 200,
    breakdown: [
      {
        appName: 'Test app 1',
        maus: 1000,
      },
      {
        appName: 'Test app 2',
        maus: 2000,
      },
      {
        appName: 'Test app 3',
        maus: 3000,
      },
    ],
  },
  {
    month: 'APRIL',
    year: 2023,
    amount: 100,
    breakdown: [
      {
        appName: 'Test app 1',
        maus: 1000,
      },
      {
        appName: 'Test app 2',
        maus: 1000,
      },
      {
        appName: 'Test app 3',
        maus: 1000,
      },
    ],
  },
  {
    month: 'MARCH',
    year: 2023,
    amount: 20,
    breakdown: [
      {
        appName: 'Test app 1',
        maus: 500,
      },
      {
        appName: 'Test app 2',
        maus: 500,
      },
      {
        appName: 'Test app 3',
        maus: 300,
      },
    ],
  },
]

const cards = ['CARD ENDING 4433', 'CARD ENDING 2793']
const selectedCard = ref(cards[0])

function handleExpand(invoice) {
  const expandValue = `${invoice.month} ${invoice.year}`
  if (expandInvoice.value !== expandValue) {
    expandInvoice.value = expandValue
  } else {
    expandInvoice.value = ''
  }
}

function handleDownload(invoice) {
  loaderStore.showLoader(
    `Downloading the invoice for ${invoice.month} ${invoice.year}`
  )
  setTimeout(() => {
    toast.success('Invoice downloaded')
    loaderStore.hideLoader()
  }, 2000)
}

function toggleCardOptions() {
  expandCardOptions.value = !expandCardOptions.value
}

function handleCardChange(card) {
  selectedCard.value = card
  expandCardOptions.value = false
}
</script>

<template>
  <div>
    <app-header />
    <main class="container">
      <h1 class="heading">INVOICES</h1>
      <section class="personal-details">
        <SettingCard>
          <template #title>ESTIMATED CHARGES</template>
          <VStack direction="column" gap="1.5rem">
            <VStack wrap justify="space-between" gap="1rem">
              <span class="charge-details">Amount Due:</span>
              <span class="charge-details amount">$200.23</span>
            </VStack>
            <VStack wrap justify="space-between" gap="1rem">
              <span class="charge-details">Due Date:</span>
              <span class="charge-details">21 MAY 2023</span>
            </VStack>
            <VStack wrap justify="space-between" gap="1rem">
              <span class="charge-details">PAYMENT METHOD:</span>
              <VStack gap="0.625rem" class="position-relative">
                <span class="charge-details text-uppercase">{{
                  selectedCard
                }}</span>
                <img
                  src="@/assets/iconography/dropdown.svg"
                  class="cursor-pointer card-option"
                  :class="{ 'card-option-expanded': expandCardOptions }"
                  @click.stop="toggleCardOptions"
                />
                <Transition name="fade">
                  <VStack
                    v-if="expandCardOptions"
                    direction="column"
                    class="position-absolute card-option-popup"
                  >
                    <div
                      v-for="card in cards"
                      :key="card"
                      class="text-uppercase cursor-pointer popup-item"
                      @click.stop="handleCardChange(card)"
                    >
                      {{ card }}
                    </div>
                  </VStack>
                </Transition>
              </VStack>
            </VStack>
          </VStack>
          <VStack style="justify-content: end; margin-top: 1rem">
            <VButton label="PAY NOW" />
          </VStack>
        </SettingCard>
      </section>
      <section style="margin-top: 1.25rem; margin-bottom: 3rem">
        <VStack direction="column" gap="1.25rem">
          <VCard
            v-for="invoice in invoices"
            :key="invoice.month + invoice.year"
            class="invoice-card"
            :class="{
              expanded: expandInvoice === `${invoice.month} ${invoice.year}`,
            }"
          >
            <VStack direction="column" class="flex-grow">
              <VStack
                justify="space-between"
                class="cursor-pointer"
                style="padding: 2rem"
                @click.stop="handleExpand(invoice)"
              >
                <span class="invoice-title"
                  >{{ invoice.month }} {{ invoice.year }}</span
                >
                <VStack gap="1.5rem">
                  <span
                    class="invoice-title"
                    :class="{
                      amount:
                        expandInvoice === `${invoice.month} ${invoice.year}`,
                    }"
                    >${{ invoice.amount }}</span
                  >
                  <img
                    src="@/assets/iconography/download.svg"
                    class="cursor-pointer"
                    @click.stop="handleDownload(invoice)"
                  />
                </VStack>
              </VStack>
              <VSeperator class="separator-bleed" />
              <VCard variant="depressed" class="invoice-statement-card">
                <VStack direction="column" gap="1.5rem" class="flex-grow">
                  <VStack gap="2rem">
                    <span class="invoice-statement charge-details"
                      >App Name</span
                    >
                    <span class="invoice-statement charge-details"
                      >Billable MAU</span
                    >
                  </VStack>
                  <VSeperator class="separator-bleed" />
                  <VStack direction="column" gap="2rem" class="flex-grow">
                    <VStack
                      v-for="statement in invoice.breakdown"
                      :key="statement.appName + statement.maus"
                      gap="2rem"
                    >
                      <span class="invoice-value">{{ statement.appName }}</span>
                      <span class="invoice-value">{{ statement.maus }}</span>
                    </VStack>
                  </VStack>
                </VStack>
              </VCard>
            </VStack>
          </VCard>
        </VStack>
      </section>
    </main>
  </div>
</template>

<style scoped>
.details {
  gap: 1em;
  width: 280px;
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

.invoice-card {
  height: 4rem;
  padding-bottom: 2rem;
  overflow: hidden;
}

.invoice-statement-card {
  padding: 2rem;
  margin: 2rem 2rem 0;
}

.invoice-card.expanded {
  height: 100%;
}

.separator-bleed {
  width: calc(100% + 4rem);
  margin-inline: -2rem;
}

label {
  color: var(--text-grey);
}

.invoice-statement,
.invoice-value {
  width: 50%;
}

.invoice-value {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
}

.charge-details {
  font-family: var(--font-title);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
}

.popup-item {
  padding-block: 1rem;
  padding-inline: 1.5rem;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
}

.invoice-title {
  font-family: var(--font-title);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
}

.amount {
  color: var(--color-orange);
}

.card-option {
  transition: transform 0.3s;
}

.card-option-expanded {
  transform: rotate(-180deg);
}

.card-option-popup {
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 100;
  background: #161616;
  border-radius: 10px;
  box-shadow: -4px -5px 4px rgb(0 0 0 / 20%), 4px 5px 4px rgb(0 0 0 / 20%);
}

@media only screen and (max-width: 1023px) {
  .heading {
    margin-top: 0.9em;
    font-size: 1.8em;
  }
}
</style>
