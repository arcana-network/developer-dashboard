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
    title: 'How to set up social auth?',
    description:
      'Configure social authentication and then use plug and play or build your own UI to onboard users.',
    thumbnail_url: TutorialSocialAuth,
    link: 'https://docs.arcana.network/howto/config_social_providers.html',
  },
  {
    id: '2',
    title: 'How to enable up passwordless login?',
    description:
      'Allow users to onboard your web3 applications in a passwordless manner easily.',
    thumbnail_url: TutorialPasswordlessAuth,
    link: 'https://docs.arcana.network/howto/onboard_users/wallet_pwdless_login.html',
  },
  {
    id: '3',
    title: 'How to use ‘Plug & Play Auth’ in Web3 apps?',
    description:
      'Plug in social and passwordless user authentication in your app with built-in UI to onboard users.',
    thumbnail_url: TutorialPlugAndPlayAuth,
    link: 'https://docs.arcana.network/howto/onboard_users/wallet_plugnplay.html',
  },
  {
    id: '4',
    title: 'How to enable Arcana wallet?',
    description:
      'Configure wallet, onboard users and allow authenticated users to sign blockchain transactions in a zap.',
    thumbnail_url: TutorialConnectWallet,
    link: 'https://docs.arcana.network/howto/arcana_wallet/',
  },
  {
    id: '5',
    title: 'Wallet User Guide',
    description:
      'Learn about the Arcana wallet user interface and available Web3 operations',
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
      <div
        class="flex laptop-remove smart-contract-copy justify-start flex-center flex-wrap"
      >
        <span style="margin-right: 5px; color: var(--text-grey)" class="body-1">
          Client ID:
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
        <Carousel
          class="tutorials__container"
          :breakpoints="carouselBreakpointSettings"
          :wrap-around="true"
        >
          <Slide v-for="tutorial in tutorials" :key="tutorial.id">
            <div class="tutorial__card carousel__item">
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
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </v-card>
    </main>
  </div>
</template>

<style>
.carousel__prev,
.carousel__next {
  background-color: white;
  border-radius: 10px;
}

.carousel__prev {
  left: 10px;
}

.carousel__next {
  right: 10px;
}
</style>

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
  margin-top: 10px;
}

.tutorial__card {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 350px;
  padding: 20px;
  margin: 0 10px;
  background-color: #000;
  border-radius: 10px;
  border-radius: 8px;
}

.tutorial__card * + * {
  margin-top: 7px;
}

.tutorial__thumbnail {
  width: 100%;
  height: 175px;
  margin-bottom: 10px;
  border-radius: 10px;
  object-fit: contain;
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
  font-size: 10px;
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

ol {
  padding: 0;
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
    grid-template-columns: repeat(2, 1fr);
  }
}

@media only screen and (max-width: 767px) {
  .dashboard-heading h1 {
    width: auto;
    margin-bottom: 0;
  }

  .tutorials__container {
    grid-template-columns: 1fr;
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
