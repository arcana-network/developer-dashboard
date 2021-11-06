<template>
  <div>
    <app-header />
    <main class="container" v-if="isConfigured">
      <section class="flex dashboard-heading flex-wrap">
        <h1 class="text-ellipsis flex-grow" style="min-width: 150px">
          {{ appName }}
        </h1>
        <div
          class="
            flex
            mobile-remove
            justify-content-center
            flex-center flex-wrap
          "
        >
          <span
            class="body-1 mobile-remove"
            style="margin-right: 8px"
            v-if="liveEnv"
          >
            MainNet
          </span>
          <span class="body-1 mobile-remove" style="margin-right: 8px" v-else>
            TestNet
          </span>
          <v-switch
            variant="secondary"
            style="margin-right: 1em; margin-top: 2px"
            v-model="liveEnv"
            class="mobile-remove"
            disabled
          />
          <span
            style="color: var(--text-grey); margin-right: 5px"
            class="body-1 mobile-remove"
          >
            Smart Contract Address:
          </span>
          <v-tooltip
            :title="smartContractAddress"
            tooltip-style="max-width: max-content; left: -250%"
            class="mobile-remove"
          >
            <div
              class="text-ellipsis body-1 cursor-pointer font-500"
              style="color: var(--text-white); width: 6em"
            >
              {{ smartContractAddress }}
            </div>
          </v-tooltip>
          <v-tooltip
            :title="smartContractTooltip"
            @click.stop="copySmartContractAddress"
            class="mobile-remove"
          >
            <img
              :src="SmartContractIcon"
              class="cursor-pointer"
              alt="Click to copy smart contract address"
              style="margin-left: 1em; margin-top: 4px"
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
        class="
          flex
          laptop-remove
          smart-contract-copy
          justify-center
          flex-center flex-wrap
        "
      >
        <span style="color: var(--text-grey); margin-right: 5px" class="body-1">
          Smart Contract Address:
        </span>
        <v-tooltip :title="smartContractAddress" class="">
          <div
            style="color: var(--text-white); font-weight: 500; width: 6em"
            class="body-1 text-ellipsis cursor-pointer"
          >
            {{ smartContractAddress }}
          </div>
        </v-tooltip>
        <v-tooltip
          :title="smartContractTooltip"
          @click.stop="copySmartContractAddress"
          class=""
        >
          <img
            :src="SmartContractIcon"
            alt="Click to copy smart contract address"
            style="margin-left: 1em; margin-top: 4px"
            class="cursor-pointer"
          />
        </v-tooltip>
      </div>
      <section style="margin-top: 8vh; color: var(--text-white)">
        <h2 style="margin-bottom: 2vh">OVERVIEW</h2>
        <div
          class="flex flex-wrap justify-space-between"
          style="margin-top: 20px; gap: 1em"
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
                style="margin-left: -2px; margin-top: 1px"
              />
            </div>
            <div class="flex" style="flex-grow: 1">
              <div>
                <h4 style="font-weight: 400">No of Files</h4>
                <h2 style="margin-top: 0.5em; font-size: 2em">
                  {{ actions.upload }}
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
            style="opacity: 0.5; cursor: not-allowed; flex-grow: 1; gap: 1.5em"
          >
            <div class="card-icon">
              <img
                src="@/assets/iconography/no-of-files.svg"
                alt="Number of files"
                style="margin-left: -2px; margin-top: 1px"
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
            label="Weekly"
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
                title="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut"
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
                justify-content: space-between;
                width: 95%;
                align-items: flex-end;
              "
            >
              <h2 style="font-family: var(--font-body); font-size: 2em">
                {{ storageUsed }} used
              </h2>
              <span
                class="body-1"
                style="color: var(--text-grey); font-weight: 600"
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
              style="margin-top: 0.65em; min-width: 300px"
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
                title="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut"
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
                justify-content: space-between;
                width: 95%;
                align-items: flex-end;
              "
            >
              <h2 style="font-family: var(--font-body); font-size: 2em">
                {{ bandwidthUsed }} used
              </h2>
              <span
                class="body-1"
                style="color: var(--text-grey); font-weight: 600"
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
              style="margin-top: 0.65em; min-width: 300px"
            >
              <canvas id="bandwidthChart" width="200"></canvas>
            </div>
          </section>
        </section>
        <v-seperator style="margin: 1.2em 0" />
        <div class="flex" style="gap: 1em; margin-top: 1.2em">
          <h3>ACTIONS</h3>
          <v-tooltip
            title="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut"
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
      <!-- <section
        class="flex column"
        style="margin-top: 8vh; margin-bottom: 8vh; color: var(--text-white)"
      >
        <div
          class="flex"
          style="margin-bottom: 4vh; justify-content: space-between"
        >
          <div class="flex" style="gap: 1em">
            <h2>TUTORIALS</h2>
            <v-tooltip
              title="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut"
            >
              <img src="@/assets/iconography/info-circle-outline.svg" style="cursor: pointer" />
            </v-tooltip>
          </div>
          <v-button variant="link" label="VIEW ALL" />
        </div>
        <v-stack gap="4vw" direction="row" class="overflow-x-auto">
          <v-card
            v-for="i in 3"
            :key="'tutorial' + i"
            class="flex column tutorial-card"
            variant="elevated"
            style="
              padding: 2em;
              width: 20vw;
              min-width: 200px;
              max-width: 400px;
              align-items: center;
            "
          >
            <div style="position: relative">
              <img :src="RectanglePlaceholderIcon" style="width: 100%" />
              <div
                class="controls"
                style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                "
              >
                <img class="play-pause" src="@/assets/iconography/play.svg" />
              </div>
            </div>
            <span class="sub-heading-3 tutorial-heading">
              Create a dropbox clone
            </span>
            <span class="body-1 tutorial-content">
              Learn the first steps involved in building your own version of
              Dropbox using Arcana’s privacy first stack for your own
            </span>
            <v-button
              variant="link"
              label="READ MORE"
              style="align-self: flex-start"
            />
          </v-card>
        </v-stack>
      </section> -->
    </main>
    <main v-else>
      <v-overlay>
        <div
          class="flex column"
          style="
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            color: var(--text-white);
          "
        >
          <h1 style="color: #13a3fd; letter-spacing: unset; font-weight: 700">
            Getting Started!
          </h1>
          <h2 style="font-weight: 500; margin-top: 1.1em; text-align: center">
            Create and Configure your Application
          </h2>
          <h4 class="testnet-disclaimer popup">
            DISCLAIMER: All features are in BETA stage of development. Use with
            caution . The platform is provided in an “as is” basis without any
            express or implied warranty of any kind including warranties of
            merchantability or fitness of purpose. In no event will Arcana
            Networks or its subsidiaries be held responsible for any damages. BY
            CLICKING “Configure” below, you accept the same.
          </h4>
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
  font: var(--font-serif);
  font-weight: 400;
  margin-top: 1.1em;
  line-height: 1.5em;
}
.testnet-disclaimer.popup {
  min-width: 320px;
  max-width: 720px;
  font-weight: 600;
  width: 90%;
  text-align: center;
}
.testnet-disclaimer.banner {
  margin-bottom: 1.5em;
}
.usage-container {
  padding: 2em;
}
.card-icon {
  background: linear-gradient(143.36deg, #000000 -4.7%, #000000 115.05%);
  box-shadow: inset -2px -2px 4px rgba(80, 80, 80, 0.1),
    inset 5px 5px 5px rgba(0, 0, 0, 0.21),
    inset -10px -26px 33px -28px rgba(255, 255, 255, 0.1),
    inset -50px 49px 29px 22px rgba(28, 28, 28, 0.84);
  width: 20px;
  height: 20px;
  padding: 24px;
  border-radius: 50%;
}
.overview-card {
  padding: 20px;
  align-items: center;
  min-width: 120px;
  max-width: 480px;
  width: 20vw;
}
.vr-border {
  border-right: unset;
  border-top: unset;
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
  flex-grow: 1;
  flex: 16.5%;
}
.action {
  margin: 2em;
  text-align: center;
  min-width: 80px;
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
  font-size: 1.5em;
  align-self: flex-start;
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
    flex-grow: 1;
    flex: 33%;
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
    visibility: visible;
    margin-top: 1em;
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
  }
  .action .body-1 {
    font-size: 1em;
  }
  h4 {
    font-size: 0.85em;
  }
  .overview-card {
    padding: 18px 8px;
  }
  .overview-card .flex {
    width: 90%;
    margin-left: 20px;
  }
}
</style>

<script>
import VTooltip from "@/components/lib/VTooltip/VTooltip.vue";
import CopyIcon from "@/assets/iconography/copy.svg";
import CheckIcon from "@/assets/iconography/check.svg";
import ArrowRightIcon from "@/assets/iconography/arrow-right.svg";
import RectanglePlaceholderIcon from "@/assets/iconography/Rectangle-placeholder.svg";
import VButton from "../components/lib/VButton/VButton.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VSeperator from "@/components/lib/VSeperator/VSeperator.vue";
import { useRouter } from "vue-router";
import VProgressBar from "@/components/lib/VProgressBar/VProgressBar.vue";
import {
  computed,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from "@vue/runtime-core";
import AppHeader from "@/components/AppHeader.vue";
import VOverlay from "@/components/lib/VOverlay/VOverlay.vue";
import VIconButton from "@/components/lib/VIconButton/VIconButton.vue";
import VSwitch from "@/components/lib/VSwitch/VSwitch.vue";
import VCardButton from "@/components/lib/VCardButton/VCardButton.vue";
import VStack from "@/components/lib/VStack/VStack.vue";
import {
  fetchAllApps,
  fetchStats,
  fetchPeriodicUsage,
  fetchApp,
} from "@/services/dashboard.service";
import { useStore } from "vuex";
import bytes from "bytes";
import copyToClipboard from "../utils/copyToClipboard";
import { getAddress } from "../utils/get-address";
import { updateApp } from "../services/app-config.service";
import {
  createChartView,
  updateChartView,
  getInitialUsageChartConfig,
} from "../utils/chart";
import moment from "moment";

export default {
  components: {
    VTooltip,
    VButton,
    VCard,
    VSeperator,
    VProgressBar,
    AppHeader,
    VOverlay,
    VIconButton,
    VSwitch,
    VCardButton,
    VStack,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const smartContractAddress = ref("");
    const durationSelected = ref("day");
    durationSelected.value = "month";
    const actions = ref({
      upload: 0,
      download: 0,
      share: 0,
      transfers: 0,
      revoke: 0,
      delete: 0,
    });
    const totalUsers = ref(0);
    const isConfigured = ref(true);
    const liveEnv = ref(false);
    const appName = computed(() => {
      return store.getters.appName;
    });
    const storageUsed = ref("0 B");
    const bandwidthUsed = ref("0 B");
    const storageUsedPercentage = ref(0);
    const bandwidthUsedPercentage = ref(0);
    const storageRemaining = ref("5 GB");
    const bandwidthRemaining = ref("5 GB");

    onBeforeMount(() => {
      updateAppDetails();
    });

    async function updateAppDetails() {
      try {
        const apps = await fetchAllApps();
        if (apps.data.length) {
          isConfigured.value = true;
          store.dispatch("updateAppConfigurationStatus", true);
          const currentApp = apps.data[0];
          store.dispatch("updateAppName", currentApp.name);
          store.dispatch("updateAppId", currentApp.ID);

          // Get Address
          const appAddress = await getAddress(currentApp.address);

          smartContractAddress.value = appAddress;

          const env = store.getters.env;
          const chainType = ["ethereum", "polygon", "binance"][
            currentApp.chain
          ];
          store.dispatch(env + "/updateChainType", chainType);
          const unlimitedBytes = 10995116277760;

          if (currentApp.storage_limit < unlimitedBytes) {
            const storage = bytes(currentApp.storage_limit, {
              unitSeparator: " ",
            });
            const storageValues = storage.split(" ");
            store.dispatch(env + "/updateStorage", {
              value: storageValues[0],
              unit: storageValues[1],
              isUnlimited: false,
            });
          } else {
            store.dispatch(env + "/updateStorage", {
              value: "",
              unit: "",
              isUnlimited: true,
            });
          }
          if (currentApp.banwidth_limit < unlimitedBytes) {
            const bandwidth = bytes(currentApp.bandwidth_limit, {
              unitSeparator: " ",
            });
            const bandwidthValues = bandwidth.split(" ");
            store.dispatch(env + "/updateBandwidth", {
              value: bandwidthValues[0],
              unit: bandwidthValues[1],
            });
          } else {
            store.dispatch(env + "/updateBandwidth", {
              value: "",
              unit: "",
              isUnlimited: true,
            });
          }
          fetchOtherDetails(currentApp.ID);
          if (!store.getters.smartContractAddress) {
            const config = { ...store.getters["test/config"] };
            updateApp(store.getters.appId, {
              name: store.getters.appName,
              address: smartContractAddress.value.replace("0x", ""),
              ...config,
            }).then((response) => {
              console.log(response.data);
            });
          }
          store.dispatch(
            "updateSmartContractAddress",
            smartContractAddress.value
          );
          return;
        } else {
          isConfigured.value = false;
          store.dispatch("updateAppConfigurationStatus", false);
        }
      } catch (e) {
        console.error(e);
        return [];
      }
    }

    async function fetchOtherDetails(appId) {
      try {
        updateChart();
        const stats = await fetchStats(appId);
        const env = store.getters.env;
        totalUsers.value = stats.data.no_of_users;
        actions.value = {
          download: stats.data.actions?.download,
          upload: stats.data.actions?.upload,
          delete: stats.data.actions?.delete,
          transfers: stats.data.actions?.transfers,
          share: stats.data.actions?.share,
          revoke: stats.data.actions?.revoke,
        };
        const bytes100Gb = bytes("5 GB");
        storageUsed.value = bytes(stats.data.actions?.storage, {
          unitSeparator: " ",
        });
        bandwidthUsed.value = bytes(stats.data.actions?.bandwidth, {
          unitSeparator: " ",
        });
        storageUsedPercentage.value =
          (stats.data.actions?.storage / bytes100Gb) * 100;
        bandwidthUsedPercentage.value =
          (stats.data.actions?.bandwidth / bytes100Gb) * 100;
        storageRemaining.value = bytes(
          bytes100Gb - stats.data.actions?.storage,
          {
            unitSeparator: " ",
          }
        );
        bandwidthRemaining.value = bytes(
          bytes100Gb - stats.data.actions?.bandwidth,
          {
            unitSeparator: " ",
          }
        );
        const appDetails = await fetchApp(appId);

        if (appDetails.data.cred) {
          store.dispatch(
            env + "/updateAuthDetails",
            appDetails.data.cred.map((el) => {
              return {
                type: el.verifier,
                authType: el.verifier,
                verifier: el.verifier,
                clientId: el.clientId,
                clientSecret: el.clientSecret,
                redirectUrl: el.redirectUrl,
              };
            })
          );
        } else {
          store.dispatch(env + "/updateAuthDetails", []);
        }
      } catch (e) {
        console.error(e);
        return [];
      }
    }

    function goToConfigure() {
      router.push("/configure");
    }

    const SmartContractIcon = ref(CopyIcon);
    const smartContractTooltip = ref("Click to copy");

    function copySmartContractAddress() {
      SmartContractIcon.value = CheckIcon;
      smartContractTooltip.value = "Copied";
      copyToClipboard(smartContractAddress.value);
      setTimeout(() => {
        SmartContractIcon.value = CopyIcon;
        smartContractTooltip.value = "Click to copy";
      }, 3000);
    }

    let StorageChart, BandwidthChart;

    onMounted(() => {
      setTimeout(() => {
        var storageCtx = document
          .getElementById("storageChart")
          ?.getContext("2d");
        if (storageCtx) {
          StorageChart = createChartView(storageCtx, {
            ...getInitialUsageChartConfig(),
          });
        }
        var bandwidthCtx = document
          .getElementById("bandwidthChart")
          ?.getContext("2d");
        if (bandwidthCtx) {
          BandwidthChart = createChartView(bandwidthCtx, {
            ...getInitialUsageChartConfig(),
          });
        }
      }, 100);
    });

    function goToUsers() {
      router.push("/users");
    }

    function updateChart() {
      try {
        let labels = [];
        let labelAliases = [];
        let storageData = [];
        let bandwidthData = [];
        fetchPeriodicUsage(durationSelected.value).then((periodicUsage) => {
          const data = periodicUsage.data;
          const currentDate = moment();
          switch (durationSelected.value) {
            case "day":
              for (let i = 7 - 1; i >= 0; i--) {
                const date = currentDate.clone().subtract(i, "days");
                labels.push(date.format("DD/MM"));
                labelAliases.push(date.format("D-M-Y"));
              }
              storageData = [0, 0, 0, 0, 0, 0, 0];
              bandwidthData = [0, 0, 0, 0, 0, 0, 0];
              if (data instanceof Array && data.length) {
                data.forEach((d) => {
                  const index = labelAliases.indexOf(d.day);
                  storageData[index] = Number(
                    bytes(d.storage, { unit: "MB" }).replace("MB", "")
                  );
                  bandwidthData[index] = Number(
                    bytes(d.bandwidth, {
                      unit: "MB",
                    }).replace("MB", "")
                  );
                });
              }
              break;
            case "month":
              for (let i = 12 - 1; i >= 0; i--) {
                const date = currentDate.clone().subtract(i, "months");
                labels.push(date.format("MMM"));
                labelAliases.push(date.format("M-Y"));
              }
              storageData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              bandwidthData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              if (data instanceof Array && data.length) {
                data.forEach((d) => {
                  const index = labelAliases.indexOf(d.month);
                  storageData[index] = Number(
                    bytes(d.storage, { unit: "MB" }).replace("MB", "")
                  );
                  bandwidthData[index] = Number(
                    bytes(d.bandwidth, {
                      unit: "MB",
                    }).replace("MB", "")
                  );
                });
              }
              break;
            case "quarter":
              const quarters = ["Jan-Mar", "Apr-Jun", "Jul-Sept", "Oct-Dec"];
              for (let i = 4 - 1; i >= 0; i--) {
                const date = currentDate.clone().subtract(i, "quarter");
                labels.push(quarters[date.quarter() - 1]);
                labelAliases.push(date.format("Q-Y"));
              }
              storageData = [0, 0, 0, 0];
              bandwidthData = [0, 0, 0, 0];
              if (data instanceof Array && data.length) {
                data.forEach((d) => {
                  const index = labelAliases.indexOf(d.quarter);
                  storageData[index] = Number(
                    bytes(d.storage, { unit: "MB" }).replace("MB", "")
                  );
                  bandwidthData[index] = Number(
                    bytes(d.bandwidth, {
                      unit: "MB",
                    }).replace("MB", "")
                  );
                });
              }
              break;
            case "year":
              for (let i = 2; i >= 0; i--) {
                labels.push(
                  currentDate.clone().subtract(i, "years").format("YYYY")
                );
              }
              storageData = [0, 0, 0];
              bandwidthData = [0, 0, 0];
              if (data instanceof Array && data.length) {
                data.forEach((d) => {
                  const index = labels.indexOf("" + d.year);
                  storageData[index] = Number(
                    bytes(d.storage, { unit: "MB" }).replace("MB", "")
                  );
                  bandwidthData[index] = Number(
                    bytes(d.bandwidth, {
                      unit: "MB",
                    }).replace("MB", "")
                  );
                });
              }
              break;
            default:
              break;
          }
          const storageDatasets = [
            {
              label: "Storage used in MB",
              data: storageData,
              borderColor: "white",
              borderWidth: 4,
              lineTension: 0.2,
            },
          ];
          updateChartView(StorageChart, labels, storageDatasets);
          const bandwidthDatasets = [
            {
              label: "Bandwidth used in MB",
              data: bandwidthData,
              borderColor: "white",
              borderWidth: 4,
              lineTension: 0.2,
            },
          ];
          updateChartView(BandwidthChart, labels, bandwidthDatasets);
        });
      } catch (e) {
        console.error(e);
      }
    }

    watch(
      () => durationSelected.value,
      () => {
        if (store.getters.appId) {
          updateChart();
        }
      }
    );

    return {
      SmartContractIcon,
      RectanglePlaceholderIcon,
      smartContractAddress,
      isConfigured,
      ArrowRightIcon,
      liveEnv,
      copySmartContractAddress,
      goToConfigure,
      goToUsers,
      durationSelected,
      smartContractTooltip,
      actions,
      appName,
      totalUsers,
      storageUsed,
      bandwidthUsed,
      storageUsedPercentage,
      bandwidthUsedPercentage,
      storageRemaining,
      bandwidthRemaining,
    };
  },
};
</script>