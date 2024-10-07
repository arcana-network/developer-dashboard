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
import { content, errors } from '@/utils/content'

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
    loaderStore.showLoader(content.INVOICES.FETCHING)
    const appsOverview = (await getAuthOverview('mainnet')).data
    if (appsOverview) {
      totalBill.value = appsOverview.bill
    }
    const cards = (await listCards()).data
    if (cards?.length) {
      selectedCard.value = `Card Ending ${cards[0].last4}`
    } else {
      selectedCard.value = errors.INVOICES.CARD_ERROR
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
    <main class="pb-10 container">
      <VStack class="mt-8 max-lg:mt-em0.9 max-lg:text-em1.8" gap="1rem">
        <img
          src="@/assets/iconography/back.svg"
          class="cursor-pointer w-8"
          @click.stop="router.back()"
        />
        <h1>Invoices</h1>
      </VStack>
      <section class="mt-12">
        <SettingCard>
          <template #title>Estimated Charges</template>
          <VStack direction="column" gap="1.5rem">
            <VStack wrap justify="space-between" gap="1rem">
              <span class="text-lg font-bold leading-6">Amount Due:</span>
              <span
                class="text-lg font-bold leading-6 amount text-system-orange"
                >${{ totalBill }}</span
              >
            </VStack>
            <VStack wrap justify="space-between" gap="1rem">
              <span class="text-lg font-bold leading-6">Due Date:</span>
              <span class="text-lg font-bold leading-6">{{
                getDueDate()
              }}</span>
            </VStack>
            <VStack wrap justify="space-between" gap="1rem">
              <span class="text-lg font-bold leading-6">Payment Method:</span>
              <VStack gap="0.625rem" class="relative">
                <span class="text-lg font-bold leading-6">{{
                  selectedCard
                }}</span>
              </VStack>
            </VStack>
          </VStack>
        </SettingCard>
      </section>
      <section class="mt-5 mb-12">
        <VStack direction="column" gap="1.25rem">
          <VCard
            v-for="invoice in invoices"
            :key="invoice.period"
            class="h-16 pb-8 overflow-hidden"
            :class="{
              expanded: expandInvoice === invoice.period,
              'h-full': expandInvoice === invoice.period,
            }"
          >
            <VStack direction="column" class="flex-grow">
              <VStack
                justify="space-between"
                class="cursor-pointer transition-all px-6"
                :class="[expandInvoice ? 'py-8' : 'py-4']"
                @click.stop="handleExpand(invoice)"
              >
                <span class="text-xl font-bold leading-6">{{
                  invoice.period
                }}</span>
                <VStack gap="1.5rem" align="center">
                  <span
                    class="text-xl font-bold leading-6"
                    :class="{
                      amount: expandInvoice === invoice.period,
                    }"
                    >${{ invoice.bill }}</span
                  >
                  <a
                    :href="invoice.url"
                    download
                    target="_blank"
                    class="flex"
                    @click.stop="(e) => e.preventDefault()"
                  >
                    <img src="@/assets/iconography/download.svg" />
                  </a>
                </VStack>
              </VStack>
              <VSeperator
                v-if="expandInvoice"
                class="w-calc-full-add-rem4 mx--rem2"
              />
              <VCard variant="depressed" class="p-8 m-8 mt-0">
                <VStack direction="column" gap="1.5rem" class="flex-grow">
                  <VStack gap="2rem">
                    <span class="w-1/2 text-lg font-bold leading-6"
                      >App Name</span
                    >
                    <span class="w-1/2 text-lg font-bold leading-6"
                      >Billable MAU</span
                    >
                  </VStack>
                  <VSeperator class="w-calc-full-add-rem4 mx--rem2" />
                  <VStack direction="column" gap="2rem" class="flex-grow">
                    <VStack
                      v-for="app in invoice.apps"
                      :key="app.appName + app.usage"
                      gap="2rem"
                    >
                      <span class="w-1/2 text-base leading-6">{{
                        app.appName
                      }}</span>
                      <span class="w-1/2 text-base leading-6">{{
                        app.usage
                      }}</span>
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
