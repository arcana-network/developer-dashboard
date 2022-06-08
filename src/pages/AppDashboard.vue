<script lang="ts" setup>
import bytes from 'bytes'
import type { Chart } from 'chart.js'
import moment from 'moment'
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ArrowRightIcon from '@/assets/iconography/arrow-right.svg'
import CheckIcon from '@/assets/iconography/check.svg'
import CopyIcon from '@/assets/iconography/copy.svg'
import AppHeader from '@/components/AppHeader.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VIconButton from '@/components/lib/VIconButton/VIconButton.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VProgressBar from '@/components/lib/VProgressBar/VProgressBar.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import {
  fetchPeriodicUsage,
  fetchStats,
  type Duration,
} from '@/services/gateway.service'
import chartUtils from '@/utils/chart'
import copyToClipboard from '@/utils/copyToClipboard'

const router = useRouter()
const store = useStore()
const appId = computed(() => {
  return store.getters.appId
})
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
const isConfigured = computed(() => {
  return !!store.getters.appId
})
const liveEnv = ref(false)
const appName = computed(() => {
  return store.getters.appName
})
const storageUsed = ref('0 B')
const bandwidthUsed = ref('0 B')
const storageUsedPercentage = ref(0)
const bandwidthUsedPercentage = ref(0)
const storageRemaining = ref('5 GB')
const bandwidthRemaining = ref('5 GB')
let labels: string[] = []
let labelAliases: string[] = []
let storageData: number[] = []
let bandwidthData: number[] = []
const currentDate = moment()
const quarters = ['Jan-Mar', 'Apr-Jun', 'Jul-Sept', 'Oct-Dec']

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
  if (store.getters.appId) {
    store.commit('showLoader', 'Fetching App statistics...')
    await fetchAndPopulateStatistics()
    store.commit('hideLoader')
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
  const periodicUsage = await fetchPeriodicUsage(durationSelected.value)
  updateChart(periodicUsage.data)
}

async function fetchAndPopulateUsersAndActions() {
  const stats = await fetchStats()
  totalUsers.value = stats.data.no_of_users
  actions.value = {
    download: stats.data.actions?.download,
    upload: stats.data.actions?.upload,
    delete: stats.data.actions?.delete,
    transfers: stats.data.actions?.transfers,
    share: stats.data.actions?.share,
    revoke: stats.data.actions?.revoke,
  }
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
    storageData[index] = Number(
      bytes(d.storage, { unit: 'MB' }).replace('MB', '')
    )
    bandwidthData[index] = Number(
      bytes(d.bandwidth, {
        unit: 'MB',
      }).replace('MB', '')
    )
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
    labels.push(currentDate.clone().subtract(i, 'years').format('YYYY'))
    storageData.push(0)
    bandwidthData.push(0)
  }
}

function goToConfigure() {
  router.push({ name: 'GeneralSettings' })
}

const SmartContractIcon = ref(CopyIcon)
const smartContractTooltip = ref('Click to copy')

function copyAppId() {
  SmartContractIcon.value = CheckIcon
  smartContractTooltip.value = 'Copied'
  copyToClipboard(appId.value)
  setTimeout(() => {
    SmartContractIcon.value = CopyIcon
    smartContractTooltip.value = 'Click to copy'
  }, 3000)
}

function goToUsers() {
  router.push({ name: 'Users' })
}

watch(
  () => durationSelected.value,
  () => {
    if (store.getters.appId) {
      fetchAndPopulateCharts()
    }
  }
)
</script>

<template>
  <div>
    <app-header :hide-banner="!isConfigured" />
    <main v-if="isConfigured" class="container">
      <section class="flex dashboard-heading flex-wrap">
        <h1 class="text-ellipsis flex-grow" style="min-width: 150px">
          {{ appName }}
        </h1>
        <div
          class="flex mobile-remove justify-content-center flex-center flex-wrap"
        >
          <span
            v-if="liveEnv"
            class="body-1 mobile-remove"
            style="margin-right: 8px"
          >
            MainNet
          </span>
          <span v-else class="body-1 mobile-remove" style="margin-right: 8px">
            TestNet
          </span>
          <v-switch
            v-model="liveEnv"
            variant="secondary"
            style="margin-top: 2px; margin-right: 1em"
            class="mobile-remove"
            disabled
          />
          <span
            style="margin-right: 5px; color: var(--text-grey)"
            class="body-1 mobile-remove"
          >
            App ID:
          </span>
          <div
            class="text-ellipsis body-1 font-500"
            style="max-width: 6em; color: var(--text-white)"
          >
            {{ appId }}
          </div>
          <v-tooltip
            :title="smartContractTooltip"
            class="mobile-remove"
            @click.stop="copyAppId"
          >
            <img
              :src="SmartContractIcon"
              class="cursor-pointer"
              alt="Click to copy smart contract address"
              style="margin-top: 4px; margin-left: 1em"
            />
          </v-tooltip>
        </div>
        <div
          class="configure-btn cursor-pointer justify-center flex-center"
          style="display: inline-flex"
          @click.stop="goToConfigure"
        >
          <img
            src="@/assets/iconography/settings.svg"
            alt="configure app settings"
            @click.stop="goToConfigure"
          />
          <v-button
            disabled
            variant="link"
            label="Configure"
            style="
              margin-top: 3px;
              margin-left: 0.5em;
              color: var(--primary);
              cursor: pointer;
            "
            @click.stop="goToConfigure"
          />
        </div>
      </section>
      <div
        class="flex laptop-remove smart-contract-copy justify-center flex-center flex-wrap"
      >
        <span style="margin-right: 5px; color: var(--text-grey)" class="body-1">
          App ID:
        </span>
        <v-tooltip :title="appId" class="">
          <div
            style="width: 6em; font-weight: 500; color: var(--text-white)"
            class="body-1 text-ellipsis cursor-pointer"
          >
            {{ appId }}
          </div>
        </v-tooltip>
        <v-tooltip
          :title="smartContractTooltip"
          class=""
          @click.stop="copyAppId"
        >
          <img
            :src="SmartContractIcon"
            alt="Click to copy smart contract address"
            style="margin-top: 4px; margin-left: 1em"
            class="cursor-pointer"
          />
        </v-tooltip>
      </div>
      <section style="margin-top: 8vh; color: var(--text-white)">
        <h2 style="margin-bottom: 2vh">OVERVIEW</h2>
        <div
          class="flex flex-wrap justify-space-between"
          style="gap: 1em; margin-top: 20px"
        >
          <v-card
            class="flex sm-column overview-card flex-grow"
            style="gap: 1.5em"
            variant="elevated"
          >
            <div class="card-icon">
              <img
                src="@/assets/iconography/total-users.svg"
                alt="Total users"
              />
            </div>
            <div class="flex flex-grow">
              <div>
                <h4 class="font-400">Total Users</h4>
                <h2 style="margin-top: 0.5em; font-size: 2em">
                  {{ totalUsers }}
                </h2>
              </div>
              <v-icon-button
                :icon="ArrowRightIcon"
                style="margin-left: auto"
                @click.stop="goToUsers"
              />
            </div>
          </v-card>
          <v-card
            class="flex sm-column overview-card flex-grow"
            style="gap: 1.5em"
            variant="elevated"
          >
            <div class="card-icon">
              <img
                src="@/assets/iconography/no-of-files.svg"
                alt="Number of files"
                style="margin-top: 1px; margin-left: -2px"
              />
            </div>
            <div class="flex" style="flex-grow: 1">
              <div>
                <h4 style="font-weight: 400">No of Files</h4>
                <h2 style="margin-top: 0.5em; font-size: 2em">
                  {{ actions.upload - actions.delete }}
                </h2>
              </div>
              <v-icon-button
                :icon="ArrowRightIcon"
                style="margin-left: auto; visibility: hidden"
                @click.stop="goToUsers"
              />
            </div>
          </v-card>
          <v-card
            class="flex overview-card tablet-remove"
            variant="elevated"
            style="flex-grow: 1; gap: 1.5em; cursor: not-allowed; opacity: 0.5"
          >
            <div class="card-icon">
              <img
                src="@/assets/iconography/no-of-files.svg"
                alt="Number of files"
                style="margin-top: 1px; margin-left: -2px"
              />
            </div>
            <div>
              <h4 style="font-weight: 400">Estimated Cost</h4>
              <h2 style="margin-top: 0.5em; font-size: 2em">$0</h2>
            </div>
          </v-card>
        </div>
      </section>
      <v-card
        class="column usage-container"
        variant="elevated"
        style="align-items: stretch; margin: 6vh auto"
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
          <v-card-button
            label="Quarterly"
            :active="durationSelected === 'quarter'"
            @click.stop="durationSelected = 'quarter'"
          />
          <v-card-button
            label="Yearly"
            :active="durationSelected === 'year'"
            @click.stop="durationSelected = 'year'"
          />
        </div>
        <section class="flex sm-column">
          <section
            class="flex column storage-container"
            style="flex-grow: 1; gap: 1em"
          >
            <div class="flex" style="gap: 1em; margin-top: 1.2em">
              <h3>STORAGE</h3>
              <v-tooltip
                title="This is an aggregation of the data uploaded/stored by all users of your app"
              >
                <img
                  src="@/assets/iconography/info-circle-outline.svg"
                  style="cursor: pointer"
                />
              </v-tooltip>
            </div>
            <div
              class="flex"
              style="
                align-items: flex-end;
                justify-content: space-between;
                width: 95%;
              "
            >
              <h2 style="font-family: var(--font-body); font-size: 2em">
                {{ storageUsed }} used
              </h2>
              <span
                class="body-1"
                style="font-weight: 600; color: var(--text-grey)"
              >
                {{ storageRemaining }} Remaining
              </span>
            </div>
            <v-progress-bar
              style="width: 95%"
              :percentage="storageUsedPercentage || 1"
            />
            <div
              id="storageChartContainer"
              style="min-width: 300px; margin-top: 0.65em"
            >
              <canvas id="storageChart" width="200"></canvas>
            </div>
          </section>
          <section
            class="flex column sm-column-gap"
            style="flex-grow: 1; gap: 1em"
          >
            <div class="flex" style="gap: 1em; margin-top: 1.2em">
              <h3>BANDWIDTH</h3>
              <v-tooltip
                title="This is an aggregation of data downloaded/egress by all users of your app"
              >
                <img
                  src="@/assets/iconography/info-circle-outline.svg"
                  style="cursor: pointer"
                />
              </v-tooltip>
            </div>
            <div
              class="flex"
              style="
                align-items: flex-end;
                justify-content: space-between;
                width: 95%;
              "
            >
              <h2 style="font-family: var(--font-body); font-size: 2em">
                {{ bandwidthUsed }} used
              </h2>
              <span
                class="body-1"
                style="font-weight: 600; color: var(--text-grey)"
              >
                {{ bandwidthRemaining }} Remaining
              </span>
            </div>
            <v-progress-bar
              style="width: 95%"
              :percentage="bandwidthUsedPercentage || 1"
              state="error"
            />
            <div
              id="bandwidthChartContainer"
              style="min-width: 300px; margin-top: 0.65em"
            >
              <canvas id="bandwidthChart" width="200"></canvas>
            </div>
          </section>
        </section>
        <v-seperator style="margin: 1.2em 0" />
        <div class="flex" style="gap: 1em; margin-top: 1.2em">
          <h3>ACTIONS</h3>
          <v-tooltip
            title="This is an aggregation of all Actions (uploads, downloads, shares, revokes and deletes) by all users of your app"
          >
            <img
              src="@/assets/iconography/info-circle-outline.svg"
              style="cursor: pointer"
            />
          </v-tooltip>
        </div>
        <div
          class="flex flex-wrap"
          style="align-content: stretch; margin-top: 3vh"
        >
          <div class="flex action-container">
            <div class="flex column action" style="flex-grow: 1">
              <h2>{{ actions.upload }}</h2>
              <span class="body-1">Upload</span>
            </div>
            <v-seperator :vertical="true" class="vr-border tablet-remove" />
          </div>
          <div class="flex action-container">
            <div class="flex column action" style="flex-grow: 1">
              <h2>{{ actions.download }}</h2>
              <span class="body-1">Download</span>
            </div>
            <v-seperator :vertical="true" class="vr-border tablet-remove" />
          </div>
          <div class="flex action-container">
            <div class="flex column action" style="flex-grow: 1">
              <h2>{{ actions.share }}</h2>
              <span class="body-1">Share</span>
            </div>
            <v-seperator :vertical="true" class="vr-border tablet-remove" />
          </div>
          <div class="flex action-container">
            <div class="flex column action" style="flex-grow: 1">
              <h2>{{ actions.transfers }}</h2>
              <span class="body-1">Transfers</span>
            </div>
            <v-seperator :vertical="true" class="vr-border tablet-remove" />
          </div>
          <div class="flex action-container">
            <div class="flex column action" style="flex-grow: 1">
              <h2>{{ actions.revoke }}</h2>
              <span class="body-1">Revoke</span>
            </div>
            <v-seperator :vertical="true" class="vr-border tablet-remove" />
          </div>
          <div class="flex action-container">
            <div class="flex column action" style="flex-grow: 1">
              <h2>{{ actions.delete }}</h2>
              <span class="body-1">Delete</span>
            </div>
          </div>
        </div>
      </v-card>
    </main>
    <main v-else>
      <v-overlay>
        <div
          class="flex column"
          style="
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: var(--text-white);
          "
        >
          <h1
            style="
              font-size: 4em;
              font-weight: 700;
              color: #13a3fd;
              letter-spacing: unset;
            "
          >
            Getting Started!
          </h1>
          <h2
            style="
              margin-top: 1.1em;
              font-size: 1.875em;
              font-weight: 500;
              text-align: center;
            "
          >
            Create and Configure your Application
          </h2>
          <h4 class="testnet-disclaimer popup">
            <b>Note</b>: Use with caution. This is an Alpha testnet release with
            all features being experimental. Please do not upload important data
            without backups or use it in production.
          </h4>
          <h5 class="testnet-disclaimer popup">
            <b>Disclaimer</b>: The platform is provided in an "as is" basis
            without any express or implied warranty of any kind including
            warranties of merchantability or fitness of purpose. In no event
            will Arcana Networks or its subsidiaries be held responsible for any
            damages. BY CLICKING "Configure" below, you accept the same.
          </h5>
          <v-button
            label="CONFIGURE"
            style="margin-top: 1.2em"
            :action="goToConfigure"
          />
        </div>
      </v-overlay>
    </main>
  </div>
</template>

<style scoped>
.container {
  margin-top: 4vh;
}

.testnet-disclaimer {
  margin-top: 1.1em;
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.5em;
  text-transform: uppercase;
}

.testnet-disclaimer.popup {
  width: 90%;
  min-width: 320px;
  max-width: 720px;
  text-align: center;
}

h4.testnet-disclaimer.popup {
  font-size: 1.25em;
  font-weight: 400;
}

h5.testnet-disclaimer.popup {
  font-size: 0.875em;
  font-weight: 400;
}

.testnet-disclaimer.banner {
  margin-bottom: 1.5em;
}

.usage-container {
  padding: 2em;
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

.play-pause {
  cursor: pointer;
}

.play-pause:hover {
  opacity: 0.6;
}

.duration {
  justify-content: flex-end;
}

.tutorial-heading {
  align-self: flex-start;
  font-size: 1.5em;
}

.tutorials-pane {
  overflow-x: auto;
}

@media only screen and (min-width: 1024px) {
  .configure-btn {
    margin-left: 4em;
  }

  .storage-container {
    width: 50%;
  }

  .tutorial-card {
    gap: 2em;
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
  .tablet-margin {
    margin-top: 2vh;
  }

  .configure-btn {
    margin-left: auto;
  }

  .sub-heading-5 {
    font-size: unset;
  }

  .smart-contract-copy {
    visibility: hidden;
  }

  .tutorial-heading {
    font-size: 1.1em;
  }

  .tutorial-content {
    font-size: 0.86em;
  }

  .tutorial-card {
    gap: 1em;
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

  .tutorials-pane section {
    margin-bottom: 2em;
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
