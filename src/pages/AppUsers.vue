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
          :noMessage="true"
          placeholder="Enter Wallet Address"
          :style="'width: 20em'"
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
          <table style="width: 100%">
            <tbody>
              <tr
                v-for="el in data"
                :key="el.walletAddress"
                @click.stop="
                  userLog = el;
                  showDetails = true;
                "
              >
                <td>{{ el.walletAddress }}</td>
                <td>{{ el.storage }}</td>
                <td>{{ el.bandwidth }}</td>
                <td>{{ el.actionCount }}</td>
              </tr>
            </tbody>
          </table>
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
          <span class="sub-heading-3" style="color: var(--text-white)">
            0x8B123123123b121w233x44c1saad3
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
              Email ID</span
            >
            <span class="sub-heading-3" style="color: var(--text-white)">
              {{ userLog.email }}
            </span>
          </div>
          <div class="flex column" style="gap: 1vh">
            <span class="body-1" style="color: var(--text-grey)">
              Storage
            </span>
            <span class="sub-heading-3" style="color: var(--text-white)">
              {{ userLog.storage }}
            </span>
          </div>
          <div class="flex column" style="gap: 1vh">
            <span class="body-1" style="color: var(--text-grey)">
              Bandwidth
            </span>
            <span class="sub-heading-3" style="color: var(--text-white)">
              {{ userLog.bandwidth }}
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
              <table style="width: 100%">
                <tbody>
                  <tr v-for="el in userLog.logs" :key="el">
                    <td>{{ el.type }}</td>
                    <td>{{ el.date }}</td>
                    <td>{{ el.time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-card>
        </div>
      </v-card>
    </v-overlay>
  </div>
</template>

<style scoped>
.table-container {
  height: 30vh;
  overflow-x: auto;
}
.log-container {
  height: 30vh;
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
.log-container table tbody tr td {
  min-width: 8em;
  width: 12vw;
  text-align: left;
}
.log-container table thead tr th {
  padding: 0 0.8em;
  min-width: 9em;
  width: 12vw;
  text-align: left;
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
  .log-container table tbody tr td {
    min-width: 4em;
    padding: 0.8em 0.2em;
  }
  .log-container table thead tr th {
    min-width: 5em;
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
import { onMounted } from "@vue/runtime-core";
import { Chart, registerables } from "chart.js";
export default {
  components: { AppHeader, VTextField, VCard, VOverlay },
  setup() {
    let data = [];
    for (let i = 0; i < 40; i++) {
      let logs = [];
      for (let j = 0; j < 5; j++) {
        logs = [
          ...logs,
          {
            type: "TRANSFER",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "UPLOAD",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "TRANSFER",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "DOWNLOAD",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "DOWNLOAD",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "DELETE",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "SHARE",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "REVOKE",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "DOWNLOAD",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "UPLOAD",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "DOWNLOAD",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "DOWNLOAD",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "SHARE",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "SHARE",
            date: "22/07/21",
            time: "06:31:00",
          },
          {
            type: "DELETE",
            date: "22/07/21",
            time: "06:31:00",
          },
        ];
      }
      data.push({
        walletAddress: "0x8B......1234",
        storage: "2GB",
        bandwidth: "5GB",
        actionCount: "10",
        email: "john@cena.com",
        logs,
      });
    }

    let showDetails = ref(false);
    let userLog = ref({});

    onMounted(() => {
      Chart.register(...registerables);

      const config = {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "No of users",
              data: [50, 120, 270, 150, 100, 130, 120, 270, 150, 100, 130, 120],
              borderColor: "white",
              borderWidth: 4,
              lineTension: 0.2,
            },
          ],
        },
        options: {
          animations: {
            tension: {
              duration: 1000,
              easing: "linear",
              from: 0.1,
              to: 0.2,
              loop: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "#373737",
                borderDash: [10, 10],
              },
              title: {
                font: {
                  family: "'Montserrat', sans-serif",
                  size: 20,
                  weight: 600,
                },
              },
              position: "right",
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
              labels: {
                font: {
                  family: "'Montserrat', sans-serif",
                  size: 20,
                  weight: 400,
                },
              },
            },
            tooltip: {},
          },
        },
      };
      setTimeout(() => {
        var numberOfUsersCtx = document
          .getElementById("numberOfUsersChart")
          ?.getContext("2d");
        if (numberOfUsersCtx) {
          new Chart(numberOfUsersCtx, { ...config });
        }
      }, 100);
    });

    return {
      SearchIcon,
      data,
      showDetails,
      userLog,
    };
  },
};
</script>