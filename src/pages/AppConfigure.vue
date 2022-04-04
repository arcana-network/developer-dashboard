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
      <section
        class="flex flex-wrap"
        style="align-items: center"
        v-if="isConfigured"
      >
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
      <configure-app-name
        :isConfigured="isConfigured"
        @enter-click="onFooterSave"
      />
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
        style="margin-bottom: 8em"
        :isConfigured="isConfigured"
        @value-change="onUserLimitValueChange"
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
      v-if="showLearnMorePopup"
      style="align-items: center; justify-content: center; display: flex"
    >
      <v-card
        variant="popup"
        style="
          padding: 4em 2em;
          min-width: 200px;
          max-width: 700px;
          width: 72%;
          flex-direction: column;
          gap: 1vh;
          position: relative;
        "
      >
        <header class="sub-heading-2" style="flex-grow: 1; display: flex">
          {{ selectedSubType.header }}
        </header>
        <v-seperator style="width: 100%" />
        <main class="body-1" style="font-size: 1.125em; line-height: 1.6em">
          {{ selectedSubType.description }}
        </main>
        <v-icon-button
          :icon="CloseIcon"
          class="close-learn-more"
          @click.stop="hideLearnMorePopup"
        >
        </v-icon-button>
      </v-card>
    </v-overlay>

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
          Deleting App...
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
            label="CONFIRM"
            v-wave
            @click.stop="handleDelete"
          />
        </footer>
      </v-card>
    </v-overlay>

    <v-overlay
      v-if="!isPrivateKeyDecrypted"
      style="align-items: center; justify-content: center; display: flex"
    >
      <v-card variant="popup" class="popup-card">
        <h4>Enter Password to decrypt private key</h4>
        <v-text-field
          label="Enter password"
          type="password"
          placeholder="Enter Here"
          name="password"
          id="password"
          v-model="password"
          style="width: 100%"
          :message-type="passwordMessageType"
          :message="passwordMessage"
        />
        <v-button label="Confirm" :action="onConfirmPassword" />
        <v-button
          variant="link"
          label="Forgot Password?"
          style="margin-top: 1em; align-self: center"
          :action="onForgotPassword"
        />
      </v-card>
    </v-overlay>

    <full-screen-loader v-if="loading" :message="loadingMessage" />
  </div>
</template>

<style scoped>
.container {
  margin-top: 4vh;
  margin-bottom: 6vh;
}

.close-learn-more {
  position: absolute;
  right: 1em;
  top: 1em;
  cursor: pointer;
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

.popup-card {
  padding: 4em;
  width: max-content;
  flex-direction: column;
  gap: 1vh;
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
import { computed, watch } from "@vue/runtime-core";
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
import CloseIcon from "@/assets/iconography/close.svg";

import {
  createApp,
  updateApp,
  deleteApp as deleteAppApi,
  deleteCred,
} from "@/services/app-config.service";
import signerMakeTx from "@/utils/signerMakeTx";
import FullScreenLoader from "@/components/FullScreenLoader.vue";
import { decrypt } from "@/utils/cryptoUtils";
import useArcanaAuth from "@/use/arcanaAuth";

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
    FullScreenLoader,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const arcanaAuth = useArcanaAuth();

    let liveEnvironment = ref(store.getters.env === "test" ? false : true);
    let isConfigured = computed(() => {
      return store.getters.isAppConfigured;
    });
    let step = ref(1);
    let deleteApp = ref(false);
    let proceedDelete = ref(false);
    let timer = ref(59);
    let progressTimer = ref(59000);
    let showLearnMorePopup = computed(() => {
      return store.getters.showLearnMorePopup;
    });
    let selectedSubType = computed(() => {
      return store.getters.configDetails;
    });
    let loading = ref(false);
    let loadingMessage = ref("");
    let isPrivateKeyDecrypted = ref(true);
    let password = ref("");
    let passwordMessage = ref("");
    let passwordMessageType = ref("");
    let userLimitError = false;

    const previousConfig = {
      appName: store.getters.appName,
      ...store.getters["test/config"],
    };
    let previousAuthDetails = [...store.getters["test/authDetails"]];

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

    if (!store.getters.keys.privateKey) {
      const encryptedPrivateKey = localStorage.getItem("private-key");
      if (arcanaAuth.isLoggedIn()) {
        const { privateKey, userInfo } = arcanaAuth.getUserInfo();
        store.dispatch("updateKeys", { privateKey });
        store.dispatch("updateUserInfo", {
          name: userInfo.name,
          email: userInfo.id,
        });
      } else if (encryptedPrivateKey) {
        isPrivateKeyDecrypted.value = false;
      } else {
        router.push({ name: "Login" });
      }
    }

    watch(
      () => liveEnvironment.value,
      () => {
        store.dispatch("toggleEnv");
      }
    );

    function backToDashboard() {
      resetSettings();
      router.push("/");
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

          if (!store.getters.appName?.trim()) {
            store.dispatch("updateAppNameError", true);
            document
              .getElementById("app")
              .scroll({ top: 0, behavior: "smooth" });
          } else {
            store.dispatch("updateAppNameError", false);
          }

          if (!store.getters.appNameError) {
            loading.value = true;
            loadingMessage.value = "Creating app...";
            createApp({
              name: store.getters.appName,
              ...store.getters[env.value + "/config"],
            }).then((response) => {
              const appAddress = response.data.app?.address;
              store.dispatch("updateSmartContractAddress", appAddress);
              loading.value = false;
              router.push("/");
            });
          }
        }
      } else {
        if (!store.getters.appName?.trim()) {
          store.dispatch("updateAppNameError", true);
          document.getElementById("app").scroll({ top: 0, behavior: "smooth" });
          return;
        } else {
          store.dispatch("updateAppNameError", false);
        }
        if (userLimitError) {
          document
            .getElementById("configure-step-5")
            .scrollIntoView({ top: 0, behavior: "smooth" });
          return;
        }
        const config = { ...store.getters[env.value + "/config"] };
        loading.value = true;
        loadingMessage.value = "Updating app...";
        await updateApp(store.getters.appId, {
          name: store.getters.appName,
          address: store.getters.smartContractAddress,
          ...config,
        });
        const authToRemove = [...store.getters[env.value + "/authToRemove"]];
        if (authToRemove.length) {
          const authToRemovePromises = authToRemove.map((el) => deleteCred(el));
          await Promise.all(authToRemovePromises);
          store.dispatch(env.value + "/clearAuthToRemove");
        }
        store.dispatch("configChangeReset");
        makeTx();
      }
    }

    async function makeTx() {
      const config = { ...store.getters[env.value + "/config"] };

      if (store.getters.appName !== previousConfig.appName) {
        loadingMessage.value = `Updating app name in smart contract...`;
        await signerMakeTx("setAppName", [store.getters.appName]);
      }

      const authDetails = [
        ...store.getters[store.getters.env + "/authDetails"],
      ];
      const authSignerMakeTxValue = [[], []];

      authDetails.forEach((authDetail) => {
        if (authDetail.verifier !== "passwordless") {
          authSignerMakeTxValue[0].push(authDetail.verifier);
          authSignerMakeTxValue[1].push(authDetail.clientId);
        }
      });
      await signerMakeTx("setClientIds", authSignerMakeTxValue);

      if (
        config.storage_limit !== previousConfig.storage_limit ||
        config.bandwidth_limit !== previousConfig.bandwidth_limit
      ) {
        loadingMessage.value = `Updating user limits in smart contract...`;
        await signerMakeTx("setDefaultLimit", [
          config.storage_limit,
          config.bandwidth_limit,
        ]);
      }

      loading.value = false;
      router.push("/");
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
          router.push("/");
        }
      } else {
        resetSettings();
        router.push("/");
      }
    }

    function resetSettings() {
      store.dispatch("updateAppName", previousConfig.appName);
      updateEnvConfig("test", testConfig);
      updateEnvConfig("live", liveConfig);
      store.dispatch("configChangeReset");
    }

    function updateEnvConfig(envValue, envConfig) {
      store.dispatch(envValue + "/updateRegion", envConfig.region);
      store.dispatch(envValue + "/updateChainType", envConfig.chainType);
      store.dispatch(envValue + "/updateAuthToRemove", []);
      store.dispatch(envValue + "/updateAuthDetails", envConfig.authDetails);
      store.dispatch(envValue + "/updateUserLimits", envConfig.userLimits);
    }

    function handleDelete() {
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

    function hideLearnMorePopup() {
      store.dispatch("hideLearnMorePopup");
    }

    function onForgotPassword() {
      localStorage.clear();
      store.dispatch("test/resetConfigStore");
      store.dispatch("live/resetConfigStore");
      store.dispatch("resetAuth");
      store.dispatch("resetStore");
      router.push({ name: "Login" });
    }

    async function onConfirmPassword() {
      passwordMessage.value = "";
      passwordMessageType.value = "";
      if (password.value) {
        try {
          const privateKey = await decrypt(
            localStorage.getItem("private-key"),
            password.value
          );
          store.dispatch("updateKeys", { privateKey });
          isPrivateKeyDecrypted.value = true;
        } catch (e) {
          passwordMessage.value = "Incorrect password";
          passwordMessageType.value = "error";
        }
      } else {
        passwordMessage.value = "Enter password to continue";
        passwordMessageType.value = "error";
      }
    }

    function onUserLimitValueChange(ev) {
      userLimitError = ev.state === "error";
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
      showLearnMorePopup,
      selectedSubType,
      hideLearnMorePopup,
      loading,
      loadingMessage,
      CloseIcon,
      isPrivateKeyDecrypted,
      password,
      passwordMessage,
      passwordMessageType,
      onConfirmPassword,
      onForgotPassword,
      onUserLimitValueChange,
    };
  },
};
</script>
