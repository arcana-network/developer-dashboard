<script lang="ts" setup>
import bytes from 'bytes'
import moment from 'moment'
import { ref, onBeforeMount, type Ref } from 'vue'

import SearchIcon from '@/assets/iconography/search.svg'
import AppHeader from '@/components/AppHeader.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import {
  fetchAllUsers,
  searchUsers,
  fetchAllUserTransactions,
  fetchMonthlyUsers,
} from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import chartUtils from '@/utils/chart'

type User = {
  id: string
  walletAddress: string
  storage: number
  bandwidth: number
  actionCount: number
  email: string
}

type UserLog = {
  email?: string
  walletAddress?: string
  storage?: number
  bandwidth?: number
  actionCount?: number
}

type UserTransaction = {
  type: string
  date: string
}

const users: Ref<User[]> = ref([])
const walletAddress = ref('')
const showDetails = ref(false)
const userLog: Ref<UserLog> = ref({})
const userTransactions: Ref<UserTransaction[]> = ref([])
const appId = useAppId()
const appsStore = useAppsStore()

function fetchUsers() {
  const totalUsers = appsStore.appOverview(appId).totalUsers
  fetchAllUsers(appId, 0, totalUsers).then((response) => {
    if (response.data instanceof Array) {
      users.value = response.data.map((user) => {
        return {
          id: user.id,
          email: user.email,
          walletAddress: user.address,
          storage: user.storage,
          bandwidth: user.bandwidth,
          actionCount: user.action_count,
        }
      })
    }
  })
}

function generateMonthlyUsersChart() {
  fetchMonthlyUsers(appId).then((response) => {
    const currentMonth = moment()
    let monthLabels: string[] = []
    let monthAliases: { month: number; year: number }[] = []

    for (let i = 12 - 1; i >= 0; i--) {
      const date = currentMonth.clone().subtract(i, 'months')
      monthLabels.push(date.format('MMM'))
      monthAliases.push({
        month: Number(date.format('M')),
        year: Number(date.format('Y')),
      })
    }

    const config = chartUtils.getInitialUsersChartConfig()
    config.data.labels = monthLabels
    const usersData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    if (response.data instanceof Array && response.data.length) {
      response.data.forEach((data) => {
        const index = monthAliases.findIndex((monthAlias) => {
          return (
            monthAlias.month === data.month && monthAlias.year === data.year
          )
        })
        usersData[index] = data.count
      })
    }

    config.data.datasets = [
      {
        label: 'No of users',
        data: usersData,
        borderColor: 'white',
        borderWidth: 4,
        lineTension: 0.2,
      },
    ]
    var numberOfUsersCtx = (
      document.getElementById('numberOfUsersChart') as HTMLCanvasElement
    )?.getContext('2d')
    if (numberOfUsersCtx) {
      chartUtils.createChartView(numberOfUsersCtx, { ...config })
    }
  })
}

onBeforeMount(() => {
  fetchUsers()
  generateMonthlyUsersChart()
})

function fetchUserLogsApi(address: string, index: number) {
  fetchAllUserTransactions(appId, address, 'mainnet').then((response) => {
    users.value[index].email = response.data.email
    if (response.data.transaction instanceof Array) {
      userLog.value = users.value[index]
      userTransactions.value = response.data.transaction.filter(
        (transaction: any) =>
          transaction.type && transaction.type !== 'Set convergence'
      )
    } else {
      userTransactions.value = []
    }
    userLog.value = users.value[index]
    showDetails.value = true
  })
}

function getTime(date: string) {
  return moment(new Date(date)).format('HH:mm:ss')
}

function getDate(date: string) {
  return moment(new Date(date)).format('DD-MM-YYYY')
}

function truncate(address: string) {
  return address.substr(0, 4) + '....' + address.substr(address.length - 4)
}

function searchUsersByWalletAddress() {
  if (walletAddress.value.trim()) {
    searchUsers(appId, walletAddress.value).then((response) => {
      if (response.data?.usage?.address) {
        const user = response.data.usage
        users.value = [
          {
            id: user.user_id,
            walletAddress: user.address,
            storage: user.storage,
            bandwidth: user.bandwidth,
            actionCount: user.action_count,
            email: user.email,
          },
        ]
      } else {
        users.value = []
      }
    })
  } else {
    fetchUsers()
  }
}

function convertToBytes(value: number) {
  return bytes(value, { unitSeparator: ' ' })
}
</script>

<template>
  <div>
    <main class="container mt-8">
      <h1>USERS</h1>
      <div class="flex sm-column gap-4 justify-between mt-8">
        <h4 class="user-details-title flex items-center">USER DETAILS</h4>
        <v-text-field
          v-model="walletAddress"
          :icon="SearchIcon"
          clickable-icon
          :no-message="true"
          placeholder="Enter Wallet Address"
          class="w-80"
          @icon-clicked="searchUsersByWalletAddress"
          @keyup.enter="searchUsersByWalletAddress"
        />
      </div>
      <v-card
        variant="elevated"
        class="flex column users-table-card p-em2 mt-4 max-md:p-em0.8"
      >
        <div class="table-container max-h-vh30 overflow-x-auto max-md:h-vh40">
          <table
            class="table-head my-em1 mb-em2 max-md:my-4 max-md:mt-2 max-md:mb-4"
          >
            <thead class="text-white_solid-default">
              <tr
                class="cursor-pointer rounded-px5 hover:bg-black_solid-default hover:shadow-custom active:bg-system-low_black_shadow active:shadow-none hover:text-cornflower_blue-default"
              >
                <th
                  class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                >
                  WALLET ADDRESS
                </th>
                <th
                  class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                >
                  STORAGE
                </th>
                <th
                  class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                >
                  BANDWIDTH
                </th>
                <th
                  class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                >
                  ACTION COUNT
                </th>
              </tr>
            </thead>
          </table>
          <table v-if="users.length" class="w-full">
            <tbody class="text-system-grey">
              <tr
                v-for="(user, index) in users"
                :key="user.walletAddress"
                class="cursor-pointer rounded-px5 hover:bg-black_solid-default hover:shadow-custom active:bg-system-low_black_shadow active:shadow-none hover:text-cornflower_blue-default active:text-white_solid-default"
                @click.stop="fetchUserLogsApi(user.walletAddress, index)"
              >
                <td
                  class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                >
                  {{ truncate(user.walletAddress) }}
                </td>
                <td
                  class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                >
                  {{ convertToBytes(user.storage) }}
                </td>
                <td
                  class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                >
                  {{ convertToBytes(user.bandwidth) }}
                </td>
                <td
                  class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                >
                  {{ user.actionCount }}
                </td>
              </tr>
            </tbody>
          </table>
          <h4 v-else>No records found</h4>
        </div>
      </v-card>
      <div class="flex column gap-4 mt-12">
        <h4>NUMBER OF USERS</h4>
        <v-card variant="elevated" class="h-px240 p-8">
          <canvas id="numberOfUsersChart" height="100%"></canvas>
        </v-card>
      </div>
    </main>
    <v-overlay v-if="showDetails" class="flex items-center justify-center">
      <v-card
        variant="popup"
        class="flex column gap-4 w-72% min-w-px300 max-w-px720 p-8"
      >
        <div class="flex justify-between mb-8">
          <h2 class="self-center p-px3 py-vh2">USER LOG</h2>
          <span
            v-wave
            class="body-1 p-px3 text-em1.5 font-semibold text-cornflower_blue-default cursor-pointer text-em0.9"
            @click.stop="showDetails = false"
            >X</span
          >
        </div>
        <div class="flex column gap-2vh px-vh2 mb-vh2">
          <span class="body-1 text-em0.9 text-system-grey">
            Wallet Address
          </span>
          <span
            class="text-xl m-px2 text-em1.2 font-semibold text-white_solid-default break-words max-md:m-0.5 max-md:text-em0.9"
          >
            {{ userLog.walletAddress }}
          </span>
        </div>
        <div class="flex flex-wrap gap-4vh justify-between px-vh2 mb-4">
          <div class="flex column gap-1vh">
            <span class="body-1 text-em0.9 text-system-grey">
              Public Identifier
            </span>
            <span
              class="text-xl m-px2 text-em1.2 font-semibold text-white_solid-default max-md:m-0.5 max-md:text-em0.9"
            >
              {{ userLog.email }}
            </span>
          </div>
          <div class="flex column gap-1vh">
            <span class="body-1 text-em0.9 text-system-grey"> Storage </span>
            <span
              class="text-xl m-px2 text-em1.2 font-semibold text-white_solid-default max-md:m-0.5 max-md:text-em0.9"
            >
              {{ convertToBytes(userLog.storage as number) }}
            </span>
          </div>
          <div class="flex column gap-1vh">
            <span class="body-1 text-em0.9 text-system-grey"> Bandwidth </span>
            <span
              class="text-xl m-px2 text-em1.2 font-semibold text-white_solid-default max-md:m-0.5 max-md:text-em0.9"
            >
              {{ convertToBytes(userLog.bandwidth as number) }}
            </span>
          </div>
          <div class="flex column gap-1vh">
            <span class="body-1 text-em0.9 text-system-grey">
              Action Count
            </span>
            <span
              class="text-xl m-px2 text-em1.2 font-semibold text-white_solid-default max-md:m-0.5 max-md:text-em0.9"
            >
              {{ userLog.actionCount }}
            </span>
          </div>
        </div>
        <div>
          <v-card
            variant="depressed"
            class="flex column log-table-card py-em1 pl-em2.5 px-em1 max-md:py-1 max-md:px-1 max-md:pl-3"
          >
            <div class="log-container max-h-vh30 overflow-auto max-md:h-vh30">
              <table class="log-table my-em1 mb-em2 max-md:my-em0.6">
                <thead class="text-white_solid-default">
                  <tr
                    class="cursor-pointer rounded-px5 hover:bg-black_solid-default hover:shadow-custom active:bg-system-low_black_shadow active:shadow-none hover:text-cornflower_blue-default"
                  >
                    <th
                      class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                    >
                      ACTION TYPE
                    </th>
                    <th
                      class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                    >
                      DATE
                    </th>
                    <th
                      class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                    >
                      TIME
                    </th>
                  </tr>
                </thead>
              </table>
              <table v-if="userTransactions.length" class="w-full">
                <tbody class="text-system-grey">
                  <tr
                    v-for="transaction in userTransactions"
                    :key="`${transaction.date}-${transaction.type}`"
                    class="cursor-pointer rounded-px5 hover:bg-black_solid-default active:bg-system-low_black_shadow active:shadow-none hover:shadow-custom hover:text-cornflower_blue-default active:text-white_solid-default"
                  >
                    <td
                      class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                    >
                      {{ transaction.type }}
                    </td>
                    <td
                      class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                    >
                      {{ getDate(transaction.date) }}
                    </td>
                    <td
                      class="w-vw20 min-w-em6.4 p-em0.8 mx-em0.5 text-left max-md:w-vw20 max-md:min-w-em6.4 max-md:p-em0.6 max-md:mx-em0.4 max-md:text-left max-md:text-em0.9"
                    >
                      {{ getTime(transaction.date) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else>
                <h4>No transactions found</h4>
              </div>
            </div>
          </v-card>
        </div>
      </v-card>
    </v-overlay>
  </div>
</template>
