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
import chartUtils from '@/utils/chart'

let users: Ref<any[]> = ref([])
let walletAddress = ref('')
let showDetails = ref(false)
let userLog = ref({})
let userTransactions = ref([])

function fetchUsers() {
  fetchAllUsers().then((response) => {
    if (response.data instanceof Array) {
      users.value = response.data.map((user) => {
        return {
          id: user.id,
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
  fetchMonthlyUsers().then((response) => {
    const currentMonth = moment()
    let monthLabels = []
    let monthAliases = []

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
    var numberOfUsersCtx = document
      .getElementById('numberOfUsersChart')
      ?.getContext('2d')
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
  fetchAllUserTransactions(address).then((response) => {
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
    searchUsers(walletAddress.value).then((response) => {
      if (response.data?.usage?.address) {
        const user = response.data.usage
        users.value = [
          {
            id: user.user_id,
            walletAddress: user.address,
            storage: user.storage,
            bandwidth: user.bandwidth,
            actionCount: user.action_count,
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
    <app-header />
    <main class="container" style="margin-top: 4vh">
      <h1>USERS</h1>
      <div
        class="flex sm-column"
        style="gap: 1em; justify-content: space-between; margin-top: 4vh"
      >
        <h4>USER DETAILS</h4>
        <v-text-field
          v-model="walletAddress"
          :icon="SearchIcon"
          clickable-icon
          :no-message="true"
          placeholder="Enter Wallet Address"
          :style="'width: 20em'"
          @icon-clicked="searchUsersByWalletAddress"
          @keyup.enter="searchUsersByWalletAddress"
        />
      </div>
      <v-card
        variant="raised"
        class="flex column users-table-card"
        style="margin-top: 4vh"
      >
        <div class="table-container">
          <table class="table-head">
            <thead>
              <tr>
                <th>WALLET ADDRESS</th>
                <th>STORAGE</th>
                <th>BANDWIDTH</th>
                <th>ACTION COUNT</th>
              </tr>
            </thead>
          </table>
          <table v-if="users.length" style="width: 100%">
            <tbody>
              <tr
                v-for="(user, index) in users"
                :key="user.walletAddress"
                @click.stop="fetchUserLogsApi(user.walletAddress, index)"
              >
                <td>{{ truncate(user.walletAddress) }}</td>
                <td>{{ convertToBytes(user.storage) }}</td>
                <td>{{ convertToBytes(user.bandwidth) }}</td>
                <td>{{ user.actionCount }}</td>
              </tr>
            </tbody>
          </table>
          <h4 v-else>No records found</h4>
        </div>
      </v-card>
      <div class="flex column" style="gap: 2em; margin-top: 4em">
        <h4>NUMBER OF USERS</h4>
        <v-card variant="elevated" style="height: 240px; padding: 2em">
          <canvas id="numberOfUsersChart" height="100%"></canvas>
        </v-card>
      </div>
    </main>
    <v-overlay
      v-if="showDetails"
      style="display: flex; align-items: center; justify-content: center"
    >
      <v-card
        variant="popup"
        class="flex column"
        style="
          gap: 1em;
          width: 72%;
          min-width: 300px;
          max-width: 720px;
          padding: 2em;
        "
      >
        <div
          class="flex"
          style="justify-content: space-between; margin-bottom: 2em"
        >
          <h2 style="align-self: center; padding: 3px 2vh">USER LOG</h2>
          <span
            v-wave
            style="
              padding: 3px;
              font-size: 1.5em;
              font-weight: 600;
              color: #13a3fd;
              cursor: pointer;
            "
            class="body-1"
            @click.stop="showDetails = false"
            >X</span
          >
        </div>
        <div
          class="flex column"
          style="gap: 2vh; padding: 0 2vh; margin-bottom: 2vh"
        >
          <span class="body-1" style="color: var(--text-grey)">
            Wallet Address
          </span>
          <span
            class="sub-heading-3"
            style="color: var(--text-white); word-wrap: break-word"
          >
            {{ userLog.walletAddress }}
          </span>
        </div>
        <div
          class="flex flex-wrap"
          style="
            gap: 4vh;
            justify-content: space-between;
            padding: 0 2vh;
            margin-bottom: 2vh;
          "
        >
          <div class="flex column" style="gap: 1vh">
            <span class="body-1" style="color: var(--text-grey)">
              Public Identifier
            </span>
            <span class="sub-heading-3" style="color: var(--text-white)">
              {{ userLog.email }}
            </span>
          </div>
          <div class="flex column" style="gap: 1vh">
            <span class="body-1" style="color: var(--text-grey)">
              Storage
            </span>
            <span class="sub-heading-3" style="color: var(--text-white)">
              {{ convertToBytes(userLog.storage) }}
            </span>
          </div>
          <div class="flex column" style="gap: 1vh">
            <span class="body-1" style="color: var(--text-grey)">
              Bandwidth
            </span>
            <span class="sub-heading-3" style="color: var(--text-white)">
              {{ convertToBytes(userLog.bandwidth) }}
            </span>
          </div>
          <div class="flex column" style="gap: 1vh">
            <span class="body-1" style="color: var(--text-grey)">
              Action Count
            </span>
            <span class="sub-heading-3" style="color: var(--text-white)">
              {{ userLog.actionCount }}
            </span>
          </div>
        </div>
        <div>
          <v-card variant="depressed" class="flex column log-table-card">
            <div class="log-container">
              <table class="log-table">
                <thead>
                  <tr>
                    <th>ACTION TYPE</th>
                    <th>DATE</th>
                    <th>TIME</th>
                  </tr>
                </thead>
              </table>
              <table v-if="userTransactions.length" style="width: 100%">
                <tbody>
                  <tr
                    v-for="transaction in userTransactions"
                    :key="transaction"
                  >
                    <td>{{ transaction.type }}</td>
                    <td>{{ getDate(transaction.date) }}</td>
                    <td>{{ getTime(transaction.date) }}</td>
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

<style scoped>
.table-container {
  max-height: 30vh;
  overflow-x: auto;
}

.log-container {
  max-height: 30vh;
  overflow-x: auto;
  overflow-y: auto;
}

.body-1 {
  font-size: 0.9em;
}

.sub-heading-3 {
  margin: 2px;
  font-size: 1.2em;
}

thead {
  font-family: var(--font-title);
  color: var(--text-white);
}

tbody {
  font-family: var(--font-body);
  color: var(--text-grey);
}

.table-head {
  margin: 1em 0 2em;
}

.log-table-card {
  padding: 1em 1em 1em 2.5em;
}

.log-table {
  margin: 1em 0 2em;
}

.users-table-card {
  padding: 2em;
}

th,
td {
  width: 20vw;
  min-width: 6.4em;
  padding: 0.8em;
  margin: 0 0.5em;
  text-align: left;
}

tbody tr {
  cursor: pointer;
  border-radius: 5px;
}

tbody tr:hover {
  color: #13a3fd;
  background: #171717;
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%), 0 4px 15px rgb(1 1 1 / 30%),
    inset 8px 6px 12px -2px #212121;
}

tbody tr:active {
  color: var(--text-white);
  background: rgb(255 255 255 / 10%);
  box-shadow: unset;
}

@media only screen and (max-width: 767px) {
  .table-head {
    margin: 0.5em 0 1em;
  }

  .sub-heading-3 {
    margin: 2px;
    font-size: 0.9em;
  }

  .log-table-card {
    padding: 0.4em 0.4em 0.4em 1.2em;
  }

  .log-table {
    margin: 0.6em 0;
  }

  .users-table-card {
    padding: 0.8em;
  }

  .table-container {
    height: 40vh;
  }

  .log-container {
    height: 30vh;
  }

  th,
  td {
    width: 20vw;
    min-width: 6.4em;
    padding: 0.6em;
    margin: 0 0.4em;
    font-size: 0.9em;
    text-align: left;
  }
}
</style>
