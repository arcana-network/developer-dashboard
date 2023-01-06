<script lang="ts" setup>
import bytes from 'bytes'
import type { Chart } from 'chart.js'
import moment from 'moment'
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import CheckIcon from '@/assets/iconography/check.svg'
import CopyIcon from '@/assets/iconography/copy.svg'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import { useToast } from '@/components/lib/VToast'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import {
  fetchPeriodicUsage,
  fetchStats,
  type Duration,
} from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import chartUtils from '@/utils/chart'
import copyToClipboard from '@/utils/copyToClipboard'

const router = useRouter()
const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const toast = useToast()
const appId = useAppId()

const durationSelected: Ref<Duration> = ref('month')
const actions = ref({
  upload: 0,
  download: 0,
  share: 0,
  transfers: 0,
  revoke: 0,
  delete: 0,
})
const totalUsers = ref(0)
const appAddress = ref(appsStore.selectedApp?.address)
const appName = ref(appsStore.selectedApp?.name)
const storageUsed = ref('0 B')
const bandwidthUsed = ref('0 B')
const storageUsedPercentage = ref(0)
const bandwidthUsedPercentage = ref(0)
const storageRemaining = ref('')
const bandwidthRemaining = ref('')
let labels: string[] = []
let labelAliases: (string | number)[] = []
let storageData: number[] = []
let bandwidthData: number[] = []
const currentDate = moment()
const quarters = ['Jan-Mar', 'Apr-Jun', 'Jul-Sept', 'Oct-Dec']
const storageProgressState = computed(() => {
  if (storageUsedPercentage.value <= 50) {
    return 'success'
  }
  if (storageUsedPercentage.value > 75) {
    return 'error'
  }
  return 'warn'
})

const bandwidthProgressState = computed(() => {
  if (bandwidthUsedPercentage.value <= 50) {
    return 'success'
  }
  if (bandwidthUsedPercentage.value > 75) {
    return 'error'
  }
  return 'warn'
})

let StorageChart: Chart
let BandwidthChart: Chart

onMounted(async () => {
  var storageCtx = document.getElementById('storageChart')?.getContext('2d')
  if (storageCtx) {
    StorageChart = chartUtils.createChartView(storageCtx, {
      ...chartUtils.getInitialUsageChartConfig(),
    })
  }
  var bandwidthCtx = document.getElementById('bandwidthChart')?.getContext('2d')
  if (bandwidthCtx) {
    BandwidthChart = chartUtils.createChartView(bandwidthCtx, {
      ...chartUtils.getInitialUsageChartConfig(),
    })
  }
  if (appId) {
    await appsStore.fetchAndStoreAppConfig(appId)
    loaderStore.showLoader('Fetching App statistics...')
    await fetchAndPopulateStatistics()
    loaderStore.hideLoader()
  }
})

async function fetchAndPopulateStatistics() {
  try {
    await fetchAndPopulateCharts()
    await fetchAndPopulateUsersAndActions()
  } catch (e) {
    console.error(e)
  }
}

async function fetchAndPopulateCharts() {
  const periodicUsage = await fetchPeriodicUsage(appId, durationSelected.value)
  updateChart(periodicUsage.data)
}

async function fetchAndPopulateUsersAndActions() {
  const stats = await fetchStats(appId)
  totalUsers.value = stats.data.no_of_users
  actions.value = {
    download: stats.data.actions.download,
    upload: stats.data.actions.upload,
    delete: stats.data.actions.delete,
    transfers: stats.data.actions.ownership_change,
    share: stats.data.actions.share,
    revoke: stats.data.actions.revoke,
  }

  const storage = stats.data.consumed_storage
  storageUsed.value = bytes(storage, {
    unitSeparator: ' ',
  })
  const allowedStorageLimit = stats.data.storage
  storageUsedPercentage.value = (storage / allowedStorageLimit) * 100
  storageRemaining.value = bytes(allowedStorageLimit - storage, {
    unitSeparator: ' ',
  })

  const bandwidth = stats.data.consumed_bandwidth
  bandwidthUsed.value = bytes(bandwidth, {
    unitSeparator: ' ',
  })
  const allowedBandwidthLimit = stats.data.bandwidth
  bandwidthUsedPercentage.value = (bandwidth / allowedBandwidthLimit) * 100
  bandwidthRemaining.value = bytes(allowedBandwidthLimit - bandwidth, {
    unitSeparator: ' ',
  })

  appsStore.addAppOverview(appId, {
    id: appId,
    name: appName,
    storage: {
      consumed: stats.data.consumed_storage,
      allowed: stats.data.storage,
    },
    bandwidth: {
      consumed: stats.data.consumed_bandwidth,
      allowed: stats.data.bandwidth,
    },
    noOfFiles: actions.value.upload - actions.value.delete,
    totalUsers: totalUsers.value,
    estimatedCost: 0,
    createdAt: new Date().toString(),
  })
}

function updateChart(data: any[]) {
  labels = []
  labelAliases = []
  storageData = []
  bandwidthData = []

  switch (durationSelected.value) {
    case 'day':
      generateInitialChartValuesForDay()
      break
    case 'month':
      generateInitialChartValuesForMonth()
      break
    case 'quarter':
      generateInitialChartValuesForQuarter()
      break
    case 'year':
      generateInitialChartValuesForYear()
      break
    default:
      break
  }

  data?.forEach((d) => {
    const index = labelAliases.indexOf(d[durationSelected.value])
    if (index > -1) {
      storageData[index] = Number(
        bytes(d.storage, { unit: 'MB' }).replace('MB', '')
      )
      bandwidthData[index] = Number(
        bytes(d.bandwidth, {
          unit: 'MB',
        }).replace('MB', '')
      )
    }
  })

  const storageDatasets = [
    {
      label: 'Storage used in MB',
      data: storageData,
      borderColor: 'white',
      borderWidth: 4,
      lineTension: 0.2,
    },
  ]
  chartUtils.updateChartView(StorageChart, labels, storageDatasets)

  const bandwidthDatasets = [
    {
      label: 'Bandwidth used in MB',
      data: bandwidthData,
      borderColor: 'white',
      borderWidth: 4,
      lineTension: 0.2,
    },
  ]
  chartUtils.updateChartView(BandwidthChart, labels, bandwidthDatasets)
}

function generateInitialChartValuesForDay() {
  for (let i = 7 - 1; i >= 0; i--) {
    const date = currentDate.clone().subtract(i, 'days')
    labels.push(date.format('DD/MM'))
    labelAliases.push(date.format('D-M-Y'))
    storageData.push(0)
    bandwidthData.push(0)
  }
}

function generateInitialChartValuesForMonth() {
  for (let i = 12 - 1; i >= 0; i--) {
    const date = currentDate.clone().subtract(i, 'months')
    labels.push(date.format('MMM'))
    labelAliases.push(date.format('M-Y'))
    storageData.push(0)
    bandwidthData.push(0)
  }
}

function generateInitialChartValuesForQuarter() {
  for (let i = 4 - 1; i >= 0; i--) {
    const date = currentDate.clone().subtract(i, 'quarter')
    labels.push(quarters[date.quarter() - 1])
    labelAliases.push(date.format('Q-Y'))
    storageData.push(0)
    bandwidthData.push(0)
  }
}

function generateInitialChartValuesForYear() {
  for (let i = 2; i >= 0; i--) {
    const year = currentDate.clone().subtract(i, 'years').format('YYYY')
    labels.push(year)
    labelAliases.push(Number(year))
    storageData.push(0)
    bandwidthData.push(0)
  }
}

const SmartContractIcon = ref(CopyIcon)
const smartContractTooltip = ref('Click to copy')

async function copyAppAddress() {
  try {
    SmartContractIcon.value = CheckIcon
    smartContractTooltip.value = 'Copied'
    await copyToClipboard(appAddress)
    toast.success('App address copied')
  } catch (e) {
    console.error(e)
    toast.error('Failed to copy. Try again or contact support')
  } finally {
    setTimeout(() => {
      SmartContractIcon.value = CopyIcon
      smartContractTooltip.value = 'Click to copy'
    }, 3000)
  }
}

function goToUsers() {
  router.push({ name: 'Users', params: { appId } })
}

watch(
  () => durationSelected.value,
  () => {
    fetchAndPopulateCharts()
  }
)

watch(
  () => appsStore.selectedAppId,
  () => {
    appName.value = appsStore.selectedApp?.name
    appAddress.value = appsStore.selectedApp?.address
  }
)
</script>

<template>
  <main class="container">
    <section class="flex dashboard-heading flex-wrap">
      <h1 class="text-ellipsis flex-grow" style="min-width: 150px">
        Dashboard
      </h1>
      <div
        class="flex mobile-remove justify-content-center flex-center flex-wrap"
      >
        <span
          style="margin-right: 5px; color: var(--text-grey)"
          class="body-1 mobile-remove"
        >
          App Address:
        </span>
        <v-tooltip :title="appAddress" class="">
          <div
            class="text-ellipsis body-1 font-500"
            style="max-width: 6em; color: var(--text-white)"
          >
            {{ appAddress }}
          </div>
        </v-tooltip>
        <v-tooltip
          :title="smartContractTooltip"
          class="mobile-remove"
          @click.stop="copyAppAddress"
        >
          <img
            :src="SmartContractIcon"
            class="cursor-pointer"
            alt="Click to copy smart contract address"
            style="margin-top: 4px"
          />
        </v-tooltip>
      </div>
    </section>
    <div
      class="flex laptop-remove smart-contract-copy justify-center flex-center flex-wrap"
    >
      <span style="margin-right: 5px; color: var(--text-grey)" class="body-1">
        App Address:
      </span>
      <v-tooltip :title="appAddress" class="">
        <div
          style="width: 6em; font-weight: 500; color: var(--text-white)"
          class="body-1 text-ellipsis cursor-pointer"
        >
          {{ appAddress }}
        </div>
      </v-tooltip>
      <v-tooltip
        :title="smartContractTooltip"
        class=""
        @click.stop="copyAppAddress"
      >
        <img
          :src="SmartContractIcon"
          alt="Click to copy smart contract address"
          style="margin-top: 4px"
          class="cursor-pointer"
        />
      </v-tooltip>
    </div>
    <v-card
      class="column usage-container"
      variant="elevated"
      style="align-items: stretch"
    >
      <div class="flex flex-wrap duration" style="margin-bottom: 1em">
        <v-card-button
          label="Daily"
          :active="durationSelected === 'day'"
          @click.stop="durationSelected = 'day'"
        />
        <v-card-button
          label="Monthly"
          :active="durationSelected === 'month'"
          @click.stop="durationSelected = 'month'"
        />
      </div>
      <v-seperator />
      <section class="flex sm-column">
        <h2>Users</h2>
      </section>
    </v-card>
    <v-card
      class="column usage-container"
      variant="elevated"
      style="align-items: stretch"
    >
      <section class="flex sm-column">
        <h2>Tutorials</h2>
      </section>
    </v-card>
  </main>
</template>

<style scoped>
.container {
  padding: 2rem;
}

.usage-container {
  padding: 2em;
  margin-top: 2em;
}

.card-icon {
  width: 20px;
  height: 20px;
  padding: 24px;
  background: linear-gradient(143.36deg, #000 -4.7%, #000 115.05%);
  border-radius: 50%;
  box-shadow: inset -2px -2px 4px rgb(80 80 80 / 10%),
    inset 5px 5px 5px rgb(0 0 0 / 21%),
    inset -10px -26px 33px -28px rgb(255 255 255 / 10%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
}

.overview-card {
  align-items: center;
  width: 20vw;
  min-width: 120px;
  max-width: 480px;
  padding: 20px;
}

.vr-border {
  border-top: unset;
  border-right: unset;
  border-bottom: unset;
}

.configure-btn {
  transition: tranform 0.4s;
}

.configure-btn:hover {
  opacity: 0.7;
}

.configure-btn:active {
  transform: scale(0.98);
}

.action-container {
  flex: 16.5%;
  flex-grow: 1;
}

.action {
  min-width: 80px;
  margin: 2em;
  text-align: center;
}

.action h2 {
  font-size: 3em;
}

.action span {
  margin-top: 1em;
}

.duration {
  justify-content: flex-end;
}

.limits-progress {
  height: 1rem;
}

@media only screen and (min-width: 1024px) {
  .configure-btn {
    margin-left: 4em;
  }

  .storage-container {
    width: 50%;
  }
}

@media only screen and (max-width: 1080px) {
  .dashboard-heading h1 {
    width: 100%;
    margin-bottom: 1em;
  }

  .action-container {
    flex: 33%;
    flex-grow: 1;
  }
}

@media only screen and (max-width: 1023px) {
  .configure-btn {
    margin-left: auto;
  }

  .smart-contract-copy {
    visibility: hidden;
  }
}

@media only screen and (max-width: 767px) {
  .dashboard-heading h1 {
    width: auto;
    margin-bottom: 0;
  }

  .smart-contract-copy {
    margin-top: 1em;
    visibility: visible;
  }

  .usage-container {
    padding: 0.65em;
  }

  .action {
    margin: 0.6em;
  }

  .duration {
    justify-content: center;
  }

  .overview-card {
    flex-grow: 1;
    padding: 18px 8px;
  }

  .action .body-1 {
    font-size: 1em;
  }

  h4 {
    font-size: 0.85em;
  }

  .overview-card .flex {
    width: 90%;
    margin-left: 20px;
  }
}
</style>
