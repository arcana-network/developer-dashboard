<script lang="ts" setup>
import type { Chart } from 'chart.js'
import moment from 'moment'
import { onMounted, ref, watch, type Ref } from 'vue'

import CopyIcon from '@/assets/iconography/copy.svg'
import TutorialPasswordlessAuth from '@/assets/Tutorial-passwordless-auth.png'
import TutorialPlugAndPlayAuth from '@/assets/Tutorial-plug-and-play-auth.png'
import TutorialSocialAuth from '@/assets/Tutorial-social-auth.png'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import { type Duration, fetchDau, fetchMau } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
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
const appId = useAppId()
const toast = useToast()
const durationSelected: Ref<Duration> = ref('day')
const selectedApp = appsStore.app(appId)
const appAddress = ref(selectedApp.address)
const appName = ref(selectedApp.name)
const showNoDataChart = ref(false)

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
  const chartCtx = document.getElementById('users-count-chart').getContext('2d')
  chart = chartUtils.createChartView(chartCtx, chartConfig)
  fetchActiveUsers()
})

watch(() => durationSelected.value, fetchActiveUsers)

watch(
  () => appId,
  () => {
    const app = appsStore.app(appId)
    appName.value = app.name
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
    let activeUsers = []
    let dataTemplate = {}
    if (durationSelected.value === 'day') {
      const { data } = await fetchDau(selectedApp.address)
      activeUsers = data
      dataTemplate = initialDailyData
    } else if (durationSelected.value === 'month') {
      const { data } = await fetchMau(selectedApp.address)
      activeUsers = data
      dataTemplate = initialMonthlyData
    }
    showNoDataChart.value = !activeUsers.length
    // activeUsers.forEach((item) => {
    //   const formattedDate = item.Date.split(' ').join('-')
    //   dataTemplate[formattedDate] = item.Value
    // })
    const dataSet = chartConfig.data.datasets[0]
    const labels = Object.keys(dataTemplate)
    const values = activeUsers.length ? Object.values(dataTemplate) : []
    const newDataSet = { ...dataSet, data: values }
    chartUtils.updateChartView(chart, labels, [newDataSet])
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div>
    <main style="margin-bottom: 2rem">
      <section class="flex dashboard-heading flex-wrap">
        <VStack justify="space-between" sm-direction="column" class="flex-grow">
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
          <div v-if="showNoDataChart" class="users-count-empty-state">
            <p>No Data</p>
          </div>
          <canvas
            v-else
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

  .flex {
    width: 90%;
    margin-left: 20px;
  }
}
</style>
