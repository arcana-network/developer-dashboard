<template>
  <div>
    <app-header v-if="isConfigured" />
    <header v-else class="first-time-configure-header">
      <div
        class="container flex justify-space-between"
        style="align-items: center"
      >
        <h1>CONFIGURE</h1>
        <div class="position-relative">
          <circle-progress
            :percent="(step / 5) * 100"
            :size="60"
            :border-width="4"
            :border-bg-width="4"
            fill-color="#13A3FD"
            empty-color="transparent"
          >
          </circle-progress>
          <h4 class="position-absolute step-counter">{{ step }}/5</h4>
        </div>
      </div>
    </header>
    <main class="container" :style="!isConfigured ? 'margin-bottom: 10em' : ''">
      <section class="flex flex-wrap" v-if="isConfigured">
        <img
          src="@/assets/iconography/back.svg"
          style="margin-right: 2em"
          class="cursor-pointer"
          alt="go back"
          @click.stop="backToDashboard"
        />
        <h1>CONFIGURE</h1>
        <v-stack
          direction="row"
          gap="1.2em"
          align="center"
          class="configure-options"
        >
          <v-stack direction="row" gap="1em">
            <span
              class="body-1"
              :style="liveEnvironment ? 'color: var(--text-grey)' : ''"
            >
              TestNet
            </span>
            <v-switch
              variant="secondary"
              v-model="liveEnvironment"
              disabled
              style="margin-top: 1px"
            />
            <span
              class="body-1"
              :style="!liveEnvironment ? 'color: var(--text-grey)' : ''"
            >
              MainNet
            </span>
          </v-stack>
          <div style="margin-left: auto">
            <!-- <v-tooltip title="Pause App">
              <v-icon-button :icon="PauseIcon" class="app-action" disabled />
            </v-tooltip> -->
            <v-tooltip title="Delete App">
              <v-icon-button
                :icon="DeleteIcon"
                class="app-action"
                @click="deleteApp = true"
              />
            </v-tooltip>
          </div>
        </v-stack>
      </section>
      <configure-app-name :isConfigured="isConfigured" />
      <configure-app-region
        v-if="isConfigured || step >= 2"
        :style="step === 2 ? 'margin-bottom: 2em' : ''"
        :isConfigured="isConfigured"
      />
      <configure-app-chain-type
        v-if="isConfigured || step >= 3"
        :style="step === 3 ? 'margin-bottom: 2em' : ''"
        :isConfigured="isConfigured"
      />
      <configure-app-auth
        v-if="isConfigured || step >= 4"
        :style="step === 4 ? 'margin-bottom: 2em' : ''"
        :isConfigured="isConfigured"
      />
      <configure-user-limits
        v-if="isConfigured || step >= 5"
        :style="step === 5 ? 'margin-bottom: 2em' : ''"
        :isConfigured="isConfigured"
      />
    </main>
    <configure-footer
      v-if="!isConfigured"
      :saveLabel="step === 5 ? 'SAVE' : 'NEXT'"
      @save="onFooterSave"
      @cancel="onFooterCancel"
      :cancelLabel="step === 1 ? 'CANCEL' : 'PREVIOUS'"
    />
    <configure-footer
      v-else
      :show="isEdited"
      @save="onFooterSave"
      @cancel="onFooterCancel"
    />

    <v-overlay
      v-if="deleteApp"
      style="align-items: center; justify-content: center; display: flex"
    >
      <v-card
        variant="popup"
        style="
          padding: 4em 2em;
          min-width: 200px;
          max-width: 560px;
          width: 72%;
          flex-direction: column;
          gap: 1vh;
        "
      >
        <header
          class="sub-heading-1"
          style="justify-content: center; flex-grow: 1; display: flex"
        >
          Delete app
        </header>
        <v-seperator style="width: 100%" />
        <main
          class="body-3"
          style="
            padding: 2vw;
            font-size: 0.9em;
            line-height: 1.6em;
            text-align: center;
          "
        >
          Deleting the app will remove all the assets that have been uploaded by
          your application and it’s users, remove public and private keys
          assigned to users and any access controls that may have been set.
          <br /><br />
          Please press ‘Delete’ to confirm this action.
        </main>
        <footer
          class="flex sm-column"
          style="
            gap: 2vh;
            align-items: center;
            flex-grow: 1;
            justify-content: center;
          "
        >
          <v-button
            variant="secondary"
            label="CANCEL"
            v-wave
            style="border: 3px solid #28c6fa"
            @click.stop="deleteApp = false"
          />
          <v-button
            variant="primary"
            label="DELETE"
            v-wave
            :action="startDeleteTimer"
          />
        </footer>
      </v-card>
    </v-overlay>

    <v-overlay
      v-if="proceedDelete"
      style="align-items: center; justify-content: center; display: flex"
    >
      <v-card
        variant="popup"
        style="
          padding: 4vh 2em;
          min-width: 200px;
          max-width: 560px;
          width: 72%;
          flex-direction: column;
          gap: 1vh;
        "
      >
        <header
          class="sub-heading-1"
          style="justify-content: center; flex-grow: 1; display: flex"
        >
          Deleting app...
        </header>
        <div class="flex outer-clock">
          <circle-progress
            :percent="(progressTimer / 60000) * 100"
            :border-width="5"
            :border-bg-width="5"
            fill-color="#13A3FD"
            empty-color="transparent"
            :size="200"
          />
          <div class="flex inner-clock">
            <span class="sub-heading-2">
              00:{{ timer.toString().padStart(2, "0") }}
            </span>
          </div>
        </div>
        <footer
          class="flex sm-column"
          style="
            gap: 2vh;
            align-items: center;
            flex-grow: 1;
            justify-content: center;
          "
        >
          <v-button
            variant="secondary"
            label="CANCEL"
            v-wave
            style="border: 3px solid #28c6fa"
            @click.stop="handleCancelDelete"
          />
          <v-button
            variant="primary"
            label="DELETE"
            v-wave
            @click.stop="handleDelete"
          />
        </footer>
      </v-card>
    </v-overlay>
  </div>
</template>

<style scoped>
.container {
  margin-top: 4vh;
  margin-bottom: 6vh;
}

.step-counter {
  color: #13a3fd;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.app-action {
  margin-left: 1vw;
  padding: 0.8em;
}

.outer-clock {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #000000;
  box-shadow: inset 0px -13px 33px -10px rgba(255, 255, 255, 0.15),
    inset 0px 10px 53px 72px #090909;
  align-self: center;
  align-items: center;
  justify-content: center;
  margin: 3em 0;
}

.configure-options {
  margin-left: auto;
}

.first-time-configure-header {
  background: #1f1f1f;
  box-shadow: 0px 9px 25px rgba(15, 15, 15, 0.25);
  position: sticky;
  top: 0;
  z-index: 9999;
  padding: 2vh 2vw;
}

.first-time-configure-header .container {
  margin: 0 auto;
}

.inner-clock {
  position: absolute;
  width: 94%;
  height: 94%;
  background: linear-gradient(
    45.51deg,
    #000000 -78.45%,
    rgba(31, 31, 31, 0.29) 88.21%
  );
  border-radius: 50%;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.18),
    10px 10px 17px -4px rgba(10, 10, 10, 0.5),
    -8px -8px 20px -2px rgba(255, 255, 255, 0.06),
    inset 5px 5px 30px 8px rgba(32, 32, 32, 0.06);
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.form-group {
  width: 50%;
  min-width: 280px;
}

div.text-field {
  background: linear-gradient(141.48deg, #1a1a1a -4.56%, #151515 135.63%);
  box-shadow: inset -2px -2px 4px rgba(57, 57, 57, 0.44),
    inset 5px 5px 10px rgba(11, 11, 11, 0.5);
  border-radius: 10px;
}

input {
  border: none;
  box-shadow: none;
  background: transparent;
  outline: none;
  --webkit-outline: none;
  color: var(--text-white);
  font-family: var(--font-body);
  font-size: 1.25em;
  line-height: 1.5em;
  margin: 0;
  padding: 15px 20px;
  width: 2em;
  flex-grow: 1;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.usage .custom-select__trigger {
  padding: 20px;
}
@media only screen and (max-width: 767px) {
  h1 {
    font-size: 2em;
  }
  .configure-options {
    margin-top: 1em;
    margin-left: 0;
    flex-grow: 1;
    align-items: center;
  }
}
</style>

<style>
.app-section-description {
  width: 22vw;
  min-width: 280px;
}
.app-section-description .body-1 {
  color: var(--text-grey);
}
</style>

<script>
import { computed, onBeforeMount, onMounted, watch } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import AppHeader from "@/components/AppHeader.vue";
import CircleProgress from "vue3-circle-progress";
import ConfigureAppAuth from "@/components/app-configure/AppAuth.vue";
import ConfigureAppChainType from "@/components/app-configure/AppChain.vue";
import ConfigureAppName from "@/components/app-configure/AppName.vue";
import ConfigureAppRegion from "@/components/app-configure/AppRegion.vue";
import ConfigureFooter from "@/components/ConfigureFooter.vue";
import ConfigureUserLimits from "@/components/app-configure/AppUserLimits.vue";
import VButton from "@/components/lib/VButton/VButton.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VChip from "@/components/lib/VChip/VChip.vue";
import VCircularProgress from "@/components/lib/VCircularProgress/VCircularProgress.vue";
import VDropdown from "@/components/lib/VDropdown/VDropdown.vue";
import VIconButton from "@/components/lib/VIconButton/VIconButton.vue";
import VOverlay from "@/components/lib/VOverlay/VOverlay.vue";
import VSeperator from "@/components/lib/VSeperator/VSeperator.vue";
import VStack from "@/components/lib/VStack/VStack.vue";
import VSwitch from "@/components/lib/VSwitch/VSwitch.vue";
import VTextField from "@/components/lib/VTextField/VTextField.vue";
import VTooltip from "@/components/lib/VTooltip/VTooltip.vue";

import PauseIcon from "@/assets/iconography/pause-disabled.svg";
import DeleteIcon from "@/assets/iconography/delete.svg";
import {
  createApp,
  updateApp,
  deleteApp as deleteAppApi,
  deleteCred,
} from "@/services/app-config.service";
import { signerMakeTx } from "../utils/signer";
import getEnvApi from "../services/get-env-api";
import { getAddress } from "../utils/get-address";

export default {
  components: {
    AppHeader,
    CircleProgress,
    ConfigureAppAuth,
    ConfigureAppChainType,
    ConfigureAppName,
    ConfigureAppRegion,
    ConfigureFooter,
    ConfigureUserLimits,
    VButton,
    VCard,
    VChip,
    VCircularProgress,
    VDropdown,
    VIconButton,
    VOverlay,
    VSeperator,
    VStack,
    VSwitch,
    VTextField,
    VTooltip,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    let liveEnvironment = ref(store.getters.env === "test" ? false : true);
    let isConfigured = computed(() => {
      return store.getters.isAppConfigured;
    });
    let step = ref(1);
    let deleteApp = ref(false);
    let proceedDelete = ref(false);
    let timer = ref(59);
    let progressTimer = ref(59000);

    const env = computed(() => {
      return store.getters.env;
    });

    let testConfig = {
      region: store.getters["test/region"],
      chainType: store.getters["test/chainType"],
      authDetails: store.getters["test/authDetails"],
      userLimits: store.getters["test/userLimits"],
    };
    let liveConfig = {
      region: store.getters["live/region"],
      chainType: store.getters["live/chainType"],
      authDetails: store.getters["live/authDetails"],
      userLimits: store.getters["live/userLimits"],
    };

    const isEdited = computed(() => {
      return store.getters.onConfigChange;
    });

    watch(
      () => liveEnvironment.value,
      () => {
        store.dispatch("toggleEnv");
      }
    );

    function backToDashboard() {
      router.replace("/");
    }

    async function onFooterSave() {
      if (!isConfigured.value) {
        if (step.value < 6) step.value++;
        if (step.value <= 5) {
          setTimeout(() => {
            document
              .getElementById("configure-step-" + step.value)
              .scrollIntoView({ behavior: "smooth" });
          }, 10);
        } else if (step.value === 6) {
          step.value = 5;
          createApp({
            name: store.getters.appName,
            ...store.getters[env.value + "/config"],
          }).then(async (response) => {
            const appAddress = await getAddress(response.data.app?.address);

            store.dispatch("updateSmartContractAddress", appAddress);

            makeTx();
            router.replace("/");
          });
        }
      } else {
        const config = { ...store.getters[env.value + "/config"] };
        await updateApp(store.getters.appId, {
          name: store.getters.appName,
          address: store.getters.smartContractAddress.replace("0x", ""),
          ...config,
        });
        const authToRemove = [...store.getters[env.value + "/authToRemove"]];
        if (authToRemove.length) {
          const authToRemovePromises = authToRemove.map((el) => deleteCred(el));
          await Promise.all(authToRemovePromises);
          store.dispatch(env.value + "/clearAuthToRemove");
        }
        makeTx();
        store.dispatch("configChangeReset");
        router.replace("/");
      }
    }

    async function makeTx() {
      const config = { ...store.getters[env.value + "/config"] };
      const ssoClients = [
        {
          type: "google",
          method: "setGoogleClientId",
        },
        {
          type: "github",
          method: "setGithubClientId",
        },
        {
          type: "twitter",
          method: "setTwitterClientId",
        },
        {
          type: "twitch",
          method: "setTwitchClientId",
        },
        {
          type: "reddit",
          method: "setRedditClientId",
        },
        {
          type: "discord",
          method: "setDiscordClientId",
        },
      ];

      for (let ssoClient of ssoClients) {
        try {
          const clientId = store.getters[
            store.getters.env + "/authDetails"
          ].find((el) => el.verifier === ssoClient.type)?.clientId;
          if (clientId) {
            console.log(
              "Making tx for adding " + ssoClient.type + " client id"
            );
            const txResponse = await signerMakeTx({
              ...getTxRequestProps(),
              method: ssoClient.method,
              value: [clientId],
            });
            console.log(
              "Tx added for " + ssoClient.type + " client id",
              txResponse
            );
          } else {
            const txResponse = await signerMakeTx({
              ...getTxRequestProps(),
              method: ssoClient.method,
              value: [""],
            });
            console.log(
              "Tx added for " + ssoClient.type + " client id",
              txResponse
            );
          }
        } catch (e) {
          console.error("Tx failed for " + ssoClient.type);
          console.error(e);
        }
      }

      try {
        console.log(config);
        const userLimitTxResponse = await signerMakeTx({
          ...getTxRequestProps(),
          method: "setDefaultLimit",
          value: [config.storage_limit, config.bandwidth_limit],
        });
        console.log("Tx added for default limit", userLimitTxResponse);
      } catch (e) {
        console.error("Tx failed for default limit");
        console.error(e);
      }

      try {
        const appNameTxResponse = await signerMakeTx({
          ...getTxRequestProps(),
          method: "setAppName",
          value: [store.getters.appName],
        });
        console.log("Tx added for app name", appNameTxResponse);
      } catch (e) {
        console.error("Tx failed for app name");
        console.error(e);
      }
    }

    function getTxRequestProps() {
      return {
        privateKey: store.getters.keys.privateKey,
        appAddress: store.getters.smartContractAddress,
        rpc: import.meta.env.VITE_ARCANA_RPC,
        gateway: getEnvApi(),
        forwarderAddress: import.meta.env.VITE_ARCANA_FORWARDER_ADDRESS,
        accessToken: store.getters.accessToken,
      };
    }

    function onFooterCancel() {
      if (!isConfigured.value) {
        if (step.value > 0) step.value--;
        if (step.value >= 1) {
          setTimeout(() => {
            document
              .getElementById("configure-step-" + step.value)
              .scrollIntoView({ behavior: "smooth" });
          }, 10);
        } else if (step.value === 0) {
          router.replace("/");
        }
      } else {
        if (env.value === "test") {
          store.dispatch("test/updateRegion", testConfig.region);
          store.dispatch("test/updateChainType", testConfig.chainType);
          store.dispatch("test/updateAuthToRemove", []);
          store.dispatch("test/updateAuthDetails", testConfig.authDetails);
          store.dispatch("test/updateUserLimits", testConfig.userLimits);
        } else {
          store.dispatch("live/updateRegion", liveConfig.region);
          store.dispatch("live/updateChaintype", testConfig.chainType);
          store.dispatch("live/updateAuthToRemove", []);
          store.dispatch("live/updateAuthDetails", liveConfig.authDetails);
          store.dispatch("live/updateUserLimits", liveConfig.userLimits);
        }
        store.dispatch("configChangeReset");
        router.replace("/");
      }
    }

    function handleDelete() {
      localStorage.clear();
      deleteAppApi().then((response) => {
        clearInterval(intervalForTimer);
        clearInterval(intervalForDelete);
        store.dispatch("test/resetConfigStore");
        store.dispatch("live/resetConfigStore");
        store.dispatch("resetStore");
        router.push("/");
      });
    }

    let intervalForDelete;
    function deleteInterval() {
      timer.value = timer.value - 1;
      if (timer.value === 0) {
        handleDelete();
        clearInterval(intervalForDelete);
      }
    }
    let intervalForTimer;
    function timerInterval() {
      progressTimer.value = progressTimer.value - 100;
      if (progressTimer.value === 0) {
        clearInterval(intervalForTimer);
      }
    }

    function startDeleteTimer() {
      deleteApp.value = false;
      proceedDelete.value = true;
      timer.value = 59;
      progressTimer.value = 59000;
      console.log("Delete started");
      intervalForTimer = setInterval(timerInterval, 100);
      intervalForDelete = setInterval(deleteInterval, 1000);
    }

    function handleCancelDelete() {
      clearInterval(intervalForTimer);
      clearInterval(intervalForDelete);
      proceedDelete.value = false;
    }

    return {
      backToDashboard,
      liveEnvironment,
      step,
      isConfigured,
      isEdited,
      deleteApp,
      proceedDelete,
      timer,
      progressTimer,
      store,
      onFooterSave,
      onFooterCancel,
      handleDelete,
      startDeleteTimer,
      handleCancelDelete,
      PauseIcon,
      DeleteIcon,
    };
  },
};
</script>