<template>
  <div>
    <app-header />
    <main class="container" style="margin-top: 4vh">
      <h1>USERS</h1>
      <div
        class="flex sm-column"
        style="margin-top: 4vh; justify-content: space-between; gap: 1em"
      >
        <h4 style="">USER DETAILS</h4>
        <v-text-field
          :icon="SearchIcon"
          clickable-icon
          :noMessage="true"
          placeholder="Enter Wallet Address"
          v-model="walletAddress"
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
      style="align-items: center; justify-content: center; display: flex"
    >
      <v-card
        variant="popup"
        class="flex column"
        style="
          padding: 2em;
          min-width: 300px;
          max-width: 720px;
          width: 72%;
          gap: 1em;
        "
      >
        <div
          class="flex"
          style="justify-content: space-between; margin-bottom: 2em"
        >
          <h2 style="padding: 3px 2vh; align-self: center">USER LOG</h2>
          <span
            style="
              padding: 3px;
              cursor: pointer;
              color: #13a3fd;
              font-weight: 600;
              font-size: 1.5em;
            "
            class="body-1"
            @click.stop="showDetails = false"
            v-wave
            >X</span
          >
        </div>
        <div
          class="flex column"
          style="padding: 0 2vh; gap: 2vh; margin-bottom: 2vh"
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
            padding: 0 2vh;
            margin-bottom: 2vh;
            justify-content: space-between;
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
              <table style="width: 100%" v-if="userTransactions.length">
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
  overflow-y: auto;
  overflow-x: auto;
}
.body-1 {
  font-size: 0.9em;
}
.sub-heading-3 {
  font-size: 1.2em;
  margin: 2px;
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
  min-width: 6.4em;
  width: 20vw;
  text-align: left;
  padding: 0.8em;
  margin: 0 0.5em;
}
tbody tr {
  cursor: pointer;
  border-radius: 5px;
}
tbody tr:hover {
  color: #13a3fd;
  background: #171717;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 15px rgba(1, 1, 1, 0.3),
    inset 8px 6px 12px -2px #212121;
}

tbody tr:active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-white);
  box-shadow: unset;
}
@media only screen and (max-width: 767px) {
  .table-head {
    margin: 0.5em 0 1em;
  }
  .sub-heading-3 {
    font-size: 0.9em;
    margin: 2px;
  }
  .log-table-card {
    padding: 0.4em 0.4em 0.4em 1.2em;
  }
  .log-table {
    margin: 0.6em 0 0.6em;
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
    min-width: 6.4em;
    width: 20vw;
    text-align: left;
    padding: 0.6em;
    margin: 0 0.4em;
    font-size: 0.9em;
  }
}
</style>

<script>
import AppHeader from "../components/AppHeader.vue";
import VTextField from "../components/lib/VTextField/VTextField.vue";
import SearchIcon from "../assets/iconography/search.svg";
import VCard from "../components/lib/VCard/VCard.vue";
import VOverlay from "../components/lib/VOverlay/VOverlay.vue";
import { ref } from "@vue/reactivity";
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import { createChartView, getInitialUsersChartConfig } from "../utils/chart";
import {
  fetchAllUsers,
  fetchAllUserTransactions,
  fetchMonthlyUsers,
  searchUsers,
} from "../services/user.service";
import moment from "moment";
import bytes from "bytes";

export default {
  components: { AppHeader, VTextField, VCard, VOverlay },
  setup() {
    let users = ref([]);
    let walletAddress = ref("");
    let showDetails = ref(false);
    let userLog = ref({});
    let userTransactions = ref([]);

    onMounted(() => {
      fetchMonthlyUsers().then((response) => {
        const currentMonth = moment();
        let monthLabels = [];
        let monthAliases = [];

        for (let i = 12 - 1; i >= 0; i--) {
          const date = currentMonth.clone().subtract(i, "months");
          monthLabels.push(date.format("MMM"));
          monthAliases.push({
            month: Number(date.format("M")),
            year: Number(date.format("Y")),
          });
        }

        const config = getInitialUsersChartConfig();
        config.data.labels = monthLabels;
        const usersData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (response.data instanceof Array && response.data.length) {
          response.data.forEach((data) => {
            const index = monthAliases.findIndex((monthAlias) => {
              return (
                monthAlias.month === data.month && monthAlias.year === data.year
              );
            });
            usersData[index] = data.count;
          });
        }

        config.data.datasets = [
          {
            label: "No of users",
            data: usersData,
            borderColor: "white",
            borderWidth: 4,
            lineTension: 0.2,
          },
        ];
        var numberOfUsersCtx = document
          .getElementById("numberOfUsersChart")
          ?.getContext("2d");
        if (numberOfUsersCtx) {
          createChartView(numberOfUsersCtx, { ...config });
        }
      });
    });

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
            };
          });
        }
      });
    }

    onBeforeMount(() => {
      fetchUsers();
    });

    function fetchUserLogsApi(address, index) {
      fetchAllUserTransactions(address).then((response) => {
        users.value[index].email = response.data.email;
        if (response.data.transaction instanceof Array) {
          userLog.value = users.value[index];
          userTransactions.value = response.data.transaction.filter(
            (transaction) =>
              transaction.type && transaction.type !== "Set convergence"
          );
        } else {
          userTransactions.value = [];
        }
        userLog.value = users.value[index];
        showDetails.value = true;
      });
    }

    function getTime(date) {
      return moment(new Date(date)).format("HH:mm:ss");
    }

    function getDate(date) {
      return moment(new Date(date)).format("DD-MM-YYYY");
    }

    function truncate(address) {
      return address.substr(0, 4) + "...." + address.substr(address.length - 4);
    }

    function searchUsersByWalletAddress() {
      if (walletAddress.value.trim()) {
        searchUsers(walletAddress.value).then((response) => {
          if (response.data?.usage?.address) {
            const user = response.data.usage;
            users.value = [
              {
                id: user.user_id,
                walletAddress: user.address,
                storage: user.storage,
                bandwidth: user.bandwidth,
                actionCount: user.action_count,
              },
            ];
          } else {
            users.value = [];
          }
        });
      } else {
        fetchUsers();
      }
    }

    function convertToBytes(value) {
      return bytes(value, { unitSeparator: " " });
    }

    return {
      SearchIcon,
      users,
      showDetails,
      userLog,
      fetchUserLogsApi,
      getDate,
      getTime,
      truncate,
      walletAddress,
      searchUsersByWalletAddress,
      convertToBytes,
      userTransactions,
    };
  },
};
</script>