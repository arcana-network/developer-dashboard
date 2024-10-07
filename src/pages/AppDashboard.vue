<script lang="ts" setup>
import type { Chart } from 'chart.js'
import moment from 'moment'
import { onMounted, ref, watch, type Ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

import CopyIcon from '@/assets/iconography/copy.svg'
import TutorialConnectWallet from '@/assets/Tutorial-connect-wallet.png'
import TutorialPasswordlessAuth from '@/assets/Tutorial-passwordless-auth.png'
import TutorialPlugAndPlayAuth from '@/assets/Tutorial-plug-and-play-auth.png'
import TutorialSocialAuth from '@/assets/Tutorial-social-auth.png'
import TutorialWalletUserGuide from '@/assets/Tutorial-wallet-user-guide.png'
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
import { content, errors } from '@/utils/content'
import copyToClipboard from '@/utils/copyToClipboard'

const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK

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
const appAddress = computed(() => {
  let clientId = 'xar_'
  if (selectedApp.value.network === 'mainnet') {
    clientId += ARCANA_AUTH_NETWORK === 'dev' ? 'test_' : 'live_'
  } else {
    clientId += ARCANA_AUTH_NETWORK === 'dev' ? 'dev_' : 'test_'
  }
  clientId += selectedApp.value.address
  return clientId
})
const showNoDataChart = ref(false)

const carouselBreakpointSettings = {
  500: {
    itemsToShow: 1.5,
    snapAlign: 'center',
  },
  600: {
    itemsToShow: 2,
    snapAlign: 'center',
  },
  768: {
    itemsToShow: 1.5,
    snapAlign: 'center',
  },
  840: {
    itemsToShow: 2,
    snapAlign: 'center',
  },
  1024: {
    itemsToShow: 3,
    snapAlign: 'start',
  },
}

watch(
  () => route.params.appId,
  () => {
    if (route.params.appId) {
      appId.value = Number(route.params.appId)
      setTimeout(() => {
        const chartCtx = (
          document.getElementById('users-count-chart') as HTMLCanvasElement
        )?.getContext('2d')
        if (chartCtx) {
          chart = chartUtils.createChartView(chartCtx, chartConfig)
          fetchActiveUsers()
        }
      }, 1)
    }
  }
)

const tutorials = [
  {
    id: '1',
    title: 'Set up social providers',
    description:
      'Configure social providers and onboard app users with plug-and-play or custom auth UI.',
    thumbnail_url: TutorialSocialAuth,
    link: 'https://docs.arcana.network/howto/config_social/index.html',
  },
  {
    id: '2',
    title: 'Enable passwordless login',
    description:
      'Allow users to onboard your web3 applications in a passwordless manner easily.',
    thumbnail_url: TutorialPasswordlessAuth,
    link: 'https://docs.arcana.network/howto/onboard_users/wallet_pwdless_login.html',
  },
  {
    id: '3',
    title: 'Use plug-and-play auth UI',
    description:
      'Allow users to authenticate easily using a login link email to the specified address.',
    thumbnail_url: TutorialPlugAndPlayAuth,
    link: 'https://docs.arcana.network/howto/onboard_users/wallet_plugnplay.html',
  },
  {
    id: '4',
    title: 'Enable Arcana wallet',
    description:
      'Configure wallet, onboard users and allow authenticated users to sign blockchain transactions in a zap.',
    thumbnail_url: TutorialConnectWallet,
    link: 'https://docs.arcana.network/howto/arcana_wallet/',
  },
  {
    id: '5',
    title: 'Using Arcana wallet',
    description:
      'Learn about the Arcana wallet user interface and available Web3 operations.',
    thumbnail_url: TutorialWalletUserGuide,
    link: 'https://docs.arcana.network/user_guides/wallet_ui/',
  },
]

const SmartContractIcon = ref(CopyIcon)
const smartContractTooltip = ref('Click to copy')

onMounted(() => {
  const chartCtx = (
    document.getElementById('users-count-chart') as HTMLCanvasElement
  )?.getContext('2d')
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
    toast.success(content.GENERIC.COPY)
  } catch (e) {
    console.error(e)
    toast.error(errors.GENERIC.COPY)
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
    activeUsers?.forEach((item) => {
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
        borderColor: 'black',
        borderWidth: 4,
        lineTension: 0.2,
      },
    ]
    chartUtils.updateChartView(chart, labels, datasets)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div :key="appId">
    <main class="mb-8">
      <section class="flex flex-wrap">
        <VStack
          justify="space-between"
          sm-direction="column"
          class="flex-grow flex-wrap justify-between"
        >
          <h1
            class="max-px1080:w-full max-px1080:mb-4 max-md:w-auto max-md:mb-0"
          >
            Dashboard
          </h1>
          <VStack
            gap="1rem"
            class="flex justify-content-center items-center flex-wrap"
          >
            <span class="text-lg font-normal text-system-grey">
              Client ID:
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
      <v-card
        class="column p-8 mt-8 max-md:p-4 items-stretch"
        variant="elevated"
      >
        <div class="flex justify-between items-center">
          <h2 class="font-normal">Users</h2>
          <div class="flex flex-wrap justify-end max-md:justify-center">
            <v-card-button
              label="Daily"
              :active="durationSelected === 'day'"
              :class="{
                strong: durationSelected === 'day',
                'font-semibold': durationSelected === 'day',
              }"
              @click.stop="durationSelected = 'day'"
            />
            <v-card-button
              label="Monthly"
              :active="durationSelected === 'month'"
              :class="{
                strong: durationSelected === 'month',
                'font-semibold': durationSelected === 'month',
              }"
              @click.stop="durationSelected = 'month'"
            />
          </div>
        </div>
        <v-seperator
          class="w-calc-full-add-rem4 my-8 mx--rem2 max-md:w-calc-full-add-rem2 max-md:my-4 max-md:mx--rem1"
        />
        <section class="flex column">
          <div
            v-show="showNoDataChart"
            class="flex items-center justify-center my-4 font-semibold"
          >
            <p class="text-system-grey">No Data</p>
          </div>
          <canvas
            v-show="!showNoDataChart"
            id="users-count-chart"
            class="max-h-px430"
          ></canvas>
        </section>
      </v-card>
      <v-card
        class="column p-8 mt-8 max-md:p-4 items-stretch"
        variant="elevated"
      >
        <VStack justify="space-between" align="center" class="flex-grow">
          <h2>Tutorials</h2>
        </VStack>
        <VSeperator
          class="w-calc-full-add-rem4 my-8 mx--rem2 max-md:w-calc-full-add-rem2 max-md:my-4 max-md:mx--rem1"
        />
        <Carousel
          class="max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1 mt-2.5"
          :breakpoints="carouselBreakpointSettings"
          :wrap-around="true"
        >
          <Slide v-for="tutorial in tutorials" :key="tutorial.id">
            <div
              class="flex flex-col items-center justify-between w-full h-px350 p-5 mx-2.5 rounded-lg carousel__item bg-white_solid-default"
            >
              <img
                :src="tutorial.thumbnail_url"
                alt="thumbnail image"
                class="w-full h-px175 mb-2.5 rounded-lg object-contain mt-px7"
              />
              <h3 class="text-sm mt-px7">{{ tutorial.title }}</h3>
              <p class="mb-2 text-xs text-system-grey mt-px7">
                {{ tutorial.description }}
              </p>
              <a :href="tutorial.link" target="_blank" class="text-sm mt-px7"
                >Read More</a
              >
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </v-card>
    </main>
  </div>
</template>
