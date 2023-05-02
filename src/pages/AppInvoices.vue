<script lang="ts" setup>
import moment from 'moment'
import { ref, onBeforeMount, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import AppHeader from '@/components/AppHeader.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import {
  listCards,
  listInvoices,
  getAuthOverview,
} from '@/services/gateway.service'
import { useLoaderStore } from '@/stores/loader.store'

const loaderStore = useLoaderStore()

const expandInvoice = ref('')
const totalBill = ref(0)
const router = useRouter()

type InvoiceData = {
  url: string
  period: string
  apps: {
    appName: string
    usage: number
  }[]
  bill: number
}

const invoices: Ref<InvoiceData[]> = ref([])

const selectedCard = ref('')

function handleExpand(invoice: InvoiceData) {
  const expandValue = invoice.period
  if (expandInvoice.value !== expandValue) {
    expandInvoice.value = expandValue
  } else {
    expandInvoice.value = ''
  }
}

function getDueDate() {
  return moment().endOf('month').format('DD MMMM YYYY')
}

onBeforeMount(async () => {
  try {
    loaderStore.showLoader('Fetching invoices...')
    const appsOverview = (await getAuthOverview('mainnet')).data
    if (appsOverview) {
      totalBill.value = appsOverview.bill
    }
    const cards = (await listCards()).data
    if (cards?.length) {
      selectedCard.value = `Card Ending ${cards[0].last4}`
    } else {
      selectedCard.value = 'No card added'
    }
    const invoiceData = (await listInvoices('mainnet')).data
    if (invoiceData) {
      const invoicePeriods = Object.keys(invoiceData).reverse()
      invoicePeriods.forEach((invoicePeriod) => {
        const invoice = {} as InvoiceData
        invoice.apps = []
        invoice.period = moment(invoicePeriod, 'M-YYYY').format('MMMM YYYY')
        const invoiceDetails = Object.keys(invoiceData[invoicePeriod])
        invoiceDetails.forEach((invoiceDetail) => {
          if (invoiceDetail === 'bill') {
            invoice.bill = invoiceData[invoicePeriod].bill
          } else if (invoiceDetail === 'invoice_url') {
            invoice.url = invoiceData[invoicePeriod].invoice_url
          } else {
            invoice.apps.push({
              appName: invoiceDetail,
              usage: invoiceData[invoicePeriod][invoiceDetail],
            })
          }
        })
        invoices.value.push(invoice)
      })
    }
  } catch (e) {
    console.log({ e })
  } finally {
    loaderStore.hideLoader()
  }
})
</script>

<template>
  <div>
    <app-header />
    <main class="pb-10">
      <VStack class="heading" gap="1.5rem">
        <img
          src="@/assets/iconography/back.svg"
          class="cursor-pointer"
          @click.stop="router.back()"
        />
        <h1>INVOICES</h1>
      </VStack>
      <section class="personal-details">
        <SettingCard>
          <template #title>ESTIMATED CHARGES</template>
          <VStack direction="column" gap="1.5rem">
            <VStack wrap justify="space-between" gap="1rem">
              <span class="charge-details">Amount Due:</span>
              <span class="charge-details amount">${{ totalBill }}</span>
            </VStack>
            <VStack wrap justify="space-between" gap="1rem">
              <span class="charge-details">Due Date:</span>
              <span class="charge-details">{{ getDueDate() }}</span>
            </VStack>
            <VStack wrap justify="space-between" gap="1rem">
              <span class="charge-details">Payment Method:</span>
              <VStack gap="0.625rem" class="relative">
                <span class="charge-details uppercase">{{ selectedCard }}</span>
              </VStack>
            </VStack>
          </VStack>
        </SettingCard>
      </section>
      <section style="margin-top: 1.25rem; margin-bottom: 3rem">
        <VStack direction="column" gap="1.25rem">
          <VCard
            v-for="invoice in invoices"
            :key="invoice.period"
            class="invoice-card"
            :class="{
              expanded: expandInvoice === invoice.period,
            }"
          >
            <VStack direction="column" class="flex-grow">
              <VStack
                justify="space-between"
                class="cursor-pointer transition-all px-6"
                :class="[expandInvoice ? 'py-8' : 'py-4']"
                @click.stop="handleExpand(invoice)"
              >
                <span class="invoice-title">{{ invoice.period }}</span>
                <VStack gap="1.5rem" align="center">
                  <span
                    class="invoice-title"
                    :class="{
                      amount: expandInvoice === invoice.period,
                    }"
                    >${{ invoice.bill }}</span
                  >
                  <a
                    :href="invoice.url"
                    download
                    target="_blank"
                    style="display: flex"
                    @click.stop="(e) => e.preventDefault()"
                  >
                    <img src="@/assets/iconography/download.svg" />
                  </a>
                </VStack>
              </VStack>
              <VSeperator v-if="expandInvoice" class="separator-bleed" />
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
                      v-for="app in invoice.apps"
                      :key="app.appName + app.usage"
                      gap="2rem"
                    >
                      <span class="invoice-value">{{ app.appName }}</span>
                      <span class="invoice-value">{{ app.usage }}</span>
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
.heading {
  margin-top: 2rem;
}

.personal-details {
  margin-top: 3rem;
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
  font-size: 1rem;
  line-height: 1.5;
}

.charge-details {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
}

.invoice-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
}

.amount {
  color: var(--color-orange);
}

@media only screen and (max-width: 1023px) {
  .heading {
    margin-top: 0.9em;
    font-size: 1.8em;
  }
}
</style>
