<script lang="ts" setup>
import type { Chart } from 'chart.js'
import moment from 'moment'
import { onMounted, ref, watch, type Ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import CopyIcon from '@/assets/iconography/copy.svg'
import TutorialPasswordlessAuth from '@/assets/Tutorial-passwordless-auth.png'
import TutorialPlugAndPlayAuth from '@/assets/Tutorial-plug-and-play-auth.png'
import TutorialSocialAuth from '@/assets/Tutorial-social-auth.png'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import {
  type Duration,
  fetchDau,
  fetchMau,
  type ActiveUsersChartData,
} from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import chartUtils from '@/utils/chart'
import copyToClipboard from '@/utils/copyToClipboard'

type ChartData = {
  label: string
  data: number
}

const initialDailyData = [-6, -5, -4, -3, -2, -1, 0].reduce((a, b) => {
  a.push({
    label: moment().add(b, 'day').format('YYYY-MM-DD'),
    data: 0,
  })
  return a
}, [] as ChartData[])

const initialMonthlyData = [
  -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0,
].reduce((a, b) => {
  a.push({
    label: moment().add(b, 'month').format('YYYY-MM'),
    data: 0,
  })
  return a
}, [] as ChartData[])

let chart: Chart
const chartConfig = chartUtils.getInitialUsersChartConfig(
  initialDailyData.map((el) => el.label),
  initialDailyData.map((el) => el.data)
)
const appsStore = useAppsStore()
const route = useRoute()
const appId = ref(Number(route.params.appId))
const toast = useToast()
const durationSelected: Ref<Duration> = ref('day')
const selectedApp = computed(() => appsStore.app(appId.value))
const appAddress = computed(() => selectedApp.value.address)
const showNoDataChart = ref(false)

watch(
  () => route.params.appId,
  () => {
    if (route.params.appId) {
      appId.value = Number(route.params.appId)
      setTimeout(() => {
        const chartCtx = (
          document.getElementById('users-count-chart') as HTMLCanvasElement
        ).getContext('2d')
        chart = chartUtils.createChartView(chartCtx, chartConfig)
        fetchActiveUsers()
      }, 1)
    }
  }
)

const tutorials = [
  {
    id: '1',
    title: 'How to set up social auth',
    description:
      'Learn the first steps involved in building your own version of Dropbox using Arcana’s privacy first stack for your own ',
    thumbnail_url: TutorialSocialAuth,
    link: 'https://docs.arcana.network/howto/config_social_providers.html',
  },
  {
    id: '2',
    title: 'How to enable up passwordless login',
    description:
      'Learn the first steps involved in building your own version of Dropbox using Arcana’s privacy first stack for your own ',
    thumbnail_url: TutorialPasswordlessAuth,
    link: 'https://docs.arcana.network/howto/onboard_users/wallet_pwdless_login.html',
  },
  {
    id: '3',
    title: 'How to enable plug & play auth',
    description:
      'Learn the first steps involved in building your own version of Dropbox using Arcana’s privacy...',
    thumbnail_url: TutorialPlugAndPlayAuth,
    link: 'https://docs.arcana.network/howto/onboard_users/wallet_plugnplay.html',
  },
]

const SmartContractIcon = ref(CopyIcon)
const smartContractTooltip = ref('Click to copy')

onMounted(() => {
  const chartCtx = (
    document.getElementById('users-count-chart') as HTMLCanvasElement
  ).getContext('2d')
  chart = chartUtils.createChartView(chartCtx, chartConfig)
  fetchActiveUsers()
})

watch(() => durationSelected.value, fetchActiveUsers)

watch(
  () => appId,
  () => {
    const app = appsStore.app(appId)
    appAddress.value = app.address
    fetchActiveUsers()
  }
)

watch(
  () => Number(route.params.appId),
  () => {
    const app = appsStore.app(Number(route.params.appId))
    if (!app) return
    appAddress.value = app.address
    fetchActiveUsers()
  }
)

async function copyAppAddress() {
  try {
    await copyToClipboard(appAddress.value)
    toast.success('App address copied')
  } catch (e) {
    console.error(e)
    toast.error('Failed to copy. Try again or contact support')
  }
}

async function fetchActiveUsers() {
  try {
    let activeUsers: ActiveUsersChartData[] = []
    let dataTemplate: ChartData[] = []
    if (durationSelected.value === 'day') {
      const { data } = await fetchDau(
        selectedApp.value.address,
        selectedApp.value.network
      )
      activeUsers = data
      dataTemplate = [-6, -5, -4, -3, -2, -1, 0].reduce((a, b) => {
        a.push({
          label: moment().add(b, 'day').format('YYYY-MM-DD'),
          data: 0,
        })
        return a
      }, [] as ChartData[])
    } else if (durationSelected.value === 'month') {
      const { data } = await fetchMau(
        selectedApp.value.address,
        selectedApp.value.network
      )
      activeUsers = data
      dataTemplate = [-11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0].reduce(
        (a, b) => {
          a.push({
            label: moment().add(b, 'month').format('YYYY-MM'),
            data: 0,
          })
          return a
        },
        [] as ChartData[]
      )
    }
    // showNoDataChart.value = !activeUsers.length
    activeUsers.forEach((item) => {
      const formattedDate = item.Date.split(' ').join('-')
      const index = dataTemplate.findIndex((el) => el.label === formattedDate)
      if (index > -1) {
        dataTemplate[index].data = item.Value
      }
    })
    const labels = dataTemplate.map((el) => el.label)
    const values = dataTemplate.map((el) => el.data)
    const datasets = [
      {
        label: 'No of active users',
        data: values,
        borderColor: 'white',
        borderWidth: 4,
        lineTension: 0.2,
      },
    ]
    chartUtils.updateChartView(chart, labels, datasets)
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div :key="appId">
    <main style="margin-bottom: 2rem">
      <section class="flex dashboard-heading flex-wrap">
        <VStack
          justify="space-between"
          sm-direction="column"
          class="flex-grow flex-wrap"
        >
          <h1 class="heading">DASHBOARD</h1>
          <VStack
            gap="1rem"
            class="flex mobile-remove justify-content-center flex-center flex-wrap"
          >
            <span style="color: var(--text-grey)" class="body-1 mobile-remove">
              App Address:
            </span>
            <VTextField
              v-model="appAddress"
              class="text-ellipsis"
              disabled
              :title="appAddress"
              :icon="SmartContractIcon"
              clickable-icon
              no-message
              @icon-clicked="copyAppAddress"
            />
          </VStack>
        </VStack>
      </section>
      <div
        class="flex laptop-remove smart-contract-copy justify-start flex-center flex-wrap"
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
          <h2>USERS</h2>
          <div class="flex flex-wrap duration">
            <v-card-button
              label="Daily"
              :active="durationSelected === 'day'"
              :class="{ strong: durationSelected === 'day' }"
              @click.stop="durationSelected = 'day'"
            />
            <v-card-button
              label="Monthly"
              :active="durationSelected === 'month'"
              :class="{ strong: durationSelected === 'month' }"
              @click.stop="durationSelected = 'month'"
            />
          </div>
        </div>
        <v-seperator class="full-bleed-separator" />
        <section class="flex column">
          <div v-show="showNoDataChart" class="users-count-empty-state">
            <p>No Data</p>
          </div>
          <canvas
            v-show="!showNoDataChart"
            id="users-count-chart"
            class="users-count-chart"
          ></canvas>
        </section>
      </v-card>
      <v-card
        class="column usage-container"
        variant="elevated"
        style="align-items: stretch"
      >
        <VStack justify="space-between" align="center" class="flex-grow">
          <h2>TUTORIALS</h2>
          <!-- <VButton variant="link" label="VIEW ALL" /> -->
        </VStack>
        <VSeperator class="full-bleed-separator" />
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
  </div>
</template>

<style scoped>
.users-count-chart {
  max-height: 430px;
}

.users-count-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block: 1rem;
  font-family: var(--font-body);
  font-weight: 600;
}

.users-count-empty-state p {
  color: var(--text-grey);
}

.tutorials__container {
  display: flex;
  gap: 1.25rem;
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
  padding: 2rem;
  margin-top: 2rem;
}

.full-bleed-separator {
  width: calc(100% + 4rem);
  margin-block: 2rem;
  margin-inline: -2rem;
}

.duration {
  justify-content: flex-end;
}

.strong {
  font-weight: 600;
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

  .tutorials__container {
    flex-direction: column;
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
    padding: 1em;
  }

  .full-bleed-separator {
    width: calc(100% + 2rem);
    margin-block: 1rem;
    margin-inline: -1rem;
  }

  .duration {
    justify-content: center;
  }

  h4 {
    font-size: 0.85em;
  }
}
</style>
