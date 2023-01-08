<script lang="ts" setup>
import type { Chart } from 'chart.js'
import moment from 'moment'
import { onMounted, ref, watch, type Ref } from 'vue'

import CheckIcon from '@/assets/iconography/check.svg'
import CopyIcon from '@/assets/iconography/copy.svg'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import { useToast } from '@/components/lib/VToast'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import { type Duration, fetchDau, fetchMau } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import chartUtils from '@/utils/chart'
import copyToClipboard from '@/utils/copyToClipboard'

const initialDailyData = [-6, -5, -4, -3, -2, -1, 0].reduce((a, b) => {
  a[moment().day(b).format('YYYY-MM-DD')] = 0
  return a
}, {})

const initialMonthlyData = [
  -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0,
].reduce((a, b) => {
  a[moment().month(b).format('YYYY-MM')] = 0
  return a
}, {})

let chart: Chart | null = null
const chartConfig = chartUtils.getInitialUsersChartConfig(
  Object.keys(initialDailyData),
  Object.values(initialDailyData)
)
const appsStore = useAppsStore()
const { showLoader, hideLoader } = useLoaderStore()
const toast = useToast()
const durationSelected: Ref<Duration> = ref('day')
const appAddress = ref(appsStore.selectedApp?.address)
const appName = ref(appsStore.selectedApp?.name)

const tutorials = [
  {
    id: '1',
    title: 'How to set up social auth',
    description:
      'Learn the first steps involved in building your own version of Dropbox using Arcana’s privacy first stack for your own ',
    thumbnail_url:
      'https://images.unsplash.com/photo-1518461845661-a2640bd93759?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=360&q=80',
    link: 'https://docs.beta.arcana.network/docs/config_social',
  },
  {
    id: '2',
    title: 'How to enable up passwordless login',
    description:
      'Learn the first steps involved in building your own version of Dropbox using Arcana’s privacy first stack for your own ',
    thumbnail_url:
      'https://images.unsplash.com/photo-1518461845661-a2640bd93759?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=360&q=80',
    link: 'https://docs.beta.arcana.network/docs/pwdlessauth',
  },
  {
    id: '3',
    title: 'How to enable plug & play auth',
    description:
      'Learn the first steps involved in building your own version of Dropbox using Arcana’s privacy...',
    thumbnail_url:
      'https://images.unsplash.com/photo-1518461845661-a2640bd93759?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=360&q=80',
    link: 'https://docs.beta.arcana.network/docs/authplugnplay',
  },
]

const SmartContractIcon = ref(CopyIcon)
const smartContractTooltip = ref('Click to copy')

onMounted(() => {
  const chartCtx = document.getElementById('users-count-chart').getContext('2d')
  chart = chartUtils.createChartView(chartCtx, chartConfig)
  console.log({ chart })
  fetchActiveUsers()
})

watch(() => durationSelected.value, fetchActiveUsers)

watch(
  () => appsStore.selectedAppId,
  () => {
    appName.value = appsStore.selectedApp?.name
    appAddress.value = appsStore.selectedApp?.address
    fetchActiveUsers()
  }
)

async function copyAppAddress() {
  try {
    SmartContractIcon.value = CheckIcon
    smartContractTooltip.value = 'Copied'
    await copyToClipboard(appAddress.value)
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

async function fetchActiveUsers() {
  try {
    showLoader('Fetching chart data')
    let activeUsers = []
    let dataTemplate = {}
    if (durationSelected.value === 'day') {
      const { data } = await fetchDau(appsStore.selectedApp?.address)
      activeUsers = data
      dataTemplate = initialDailyData
    } else if (durationSelected.value === 'month') {
      const { data } = await fetchMau(appsStore.selectedApp?.address)
      activeUsers = data
      dataTemplate = initialMonthlyData
    }
    activeUsers.forEach((item) => {
      const formattedData = item.Date.split(' ').join('-')
      dataTemplate[formattedData] = item.Value
    })
    const dataSet = chartConfig.data.datasets[0]
    const newDataSet = { ...dataSet, data: Object.values(dataTemplate) }
    chartUtils.updateChartView(chart, Object.keys(dataTemplate), [newDataSet])
  } catch (e) {
    console.log(e)
  } finally {
    hideLoader()
  }
}
</script>

<template>
  <main>
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
      <div class="flex justify-space-between flex-center">
        <h2>Users</h2>
        <div class="flex flex-wrap duration">
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
      </div>
      <v-seperator />
      <section class="flex column">
        <div class="chart__container">
          <canvas id="users-count-chart" class="users-count-chart"></canvas>
        </div>
      </section>
    </v-card>
    <v-card
      class="column usage-container"
      variant="elevated"
      style="align-items: stretch"
    >
      <h2>Tutorials</h2>
      <div class="tutorials__container">
        <div
          v-for="tutorial in tutorials"
          :key="tutorial.id"
          class="tutorial__card"
        >
          <img
            :src="tutorial.thumbnail_url"
            alt="thumbnail image"
            class="tutorial__thumbnail"
          />
          <h3 class="tutorial__title">{{ tutorial.title }}</h3>
          <p class="tutorial__description">{{ tutorial.description }}</p>
          <a :href="tutorial.link" target="_blank" class="tutorial__link"
            >Read More</a
          >
        </div>
      </div>
    </v-card>
  </main>
</template>

<style scoped>
.users-count-chart {
  max-height: 430px;
}

.tutorials__container {
  display: flex;
  margin-top: 10px;
}

.tutorial__card {
  flex: 1;
  align-items: flex-start;
  padding: 20px;
  background-color: #000;
  border-radius: 10px;
}

.tutorial__card * + * {
  margin-top: 10px;
}

.tutorial__card:not(:last-child) {
  margin-right: 20px;
}

.tutorial__thumbnail {
  width: 100%;
  border-radius: 10px;
}

.tutorial__link {
  font-size: 14px;
  text-transform: uppercase;
}

.tutorial__title {
  font-family: var(--font-body);
  font-size: 14px;
}

.tutorial__description {
  margin-bottom: 10px;
  font-family: var(--font-body);
  font-size: 14px;
  color: #8d8d8d;
}

.usage-container {
  padding: 2em;
  margin-top: 2em;
}

.duration {
  justify-content: flex-end;
}

@media only screen and (max-width: 1080px) {
  .dashboard-heading h1 {
    width: 100%;
    margin-bottom: 1em;
  }
}

@media only screen and (max-width: 1023px) {
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

  .duration {
    justify-content: center;
  }

  h4 {
    font-size: 0.85em;
  }

  .flex {
    width: 90%;
    margin-left: 20px;
  }
}
</style>
