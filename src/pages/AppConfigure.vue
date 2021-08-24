<template>
  <div>
    <app-header v-if="isConfigured" />
    <header v-else class="first-time-configure-header">
      <div class="container flex" style="justify-content: space-between">
        <h1>CONFIGURE YOUR APP</h1>
        <div style="position: relative">
          <circle-progress
            :percent="(step / 5) * 100"
            :size="80"
            :border-width="4"
            :border-bg-width="4"
            fill-color="#13A3FD"
            empty-color="transparent"
          >
          </circle-progress>
          <h3
            style="
              position: absolute;
              color: #13a3fd;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "
          >
            {{ step }}/5
          </h3>
        </div>
      </div>
    </header>
    <main class="container" :style="!isConfigured ? 'margin-bottom: 10em' : ''">
      <section class="flex flex-wrap" v-if="isConfigured">
        <img
          :src="BackIcon"
          style="cursor: pointer; margin-right: 2em"
          alt="go back"
          @click.stop="backToDashboard"
        />
        <h1>CONFIGURE</h1>
        <div
          style="gap: 1.2em; align-items: center"
          class="flex sm-column configure-options"
        >
          <div class="flex" style="gap: 1em">
            <span
              class="body-1"
              :style="liveEnvironment ? 'color: var(--text-grey)' : ''"
              >TestNet</span
            >
            <v-switch
              variant="secondary"
              v-model="liveEnvironment"
              style="margin-top: 1px"
            />
            <span
              class="body-1"
              :style="!liveEnvironment ? 'color: var(--text-grey)' : ''"
              >MainNet</span
            >
          </div>
          <div>
            <v-tooltip title="Pause App">
              <v-icon-button
                :icon="PauseIcon"
                style="margin-left: 1vw; padding: 0.8em"
              />
            </v-tooltip>
            <v-tooltip title="Delete App">
              <v-icon-button
                :icon="DeleteIcon"
                style="margin-left: 1vw; padding: 0.8em"
                @click="deleteApp = true"
              />
            </v-tooltip>
          </div>
        </div>
      </section>
      <section
        class="flex column"
        style="margin-top: 3em; gap: 1em; align-items: flex-start"
        v-if="isConfigured"
      >
        <h2>APP NAME</h2>
        <v-text-field
          v-model="appName"
          strong
          style="width: 20vw; min-width: 200px; max-width: 400px"
        />
      </section>
      <v-card
        style="margin-top: 2em; padding: 1.5em 2em; gap: 1.2em"
        class="column"
        v-else
        :id="'configure-step-' + 1"
      >
        <h4 style="width: 100%; display: block">ENTER APP NAME</h4>
        <div
          class="flex flex-wrap"
          style="gap: 4vw; justify-content: space-between"
        >
          <div
            class="flex column"
            style="
              gap: 1.2em;
              align-items: flex-start;
              width: 22vw;
              min-width: 280px;
            "
          >
            <span class="body-1" style="color: var(--text-grey)">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
            </span>
            <v-button variant="link" label="LEARN MORE" />
          </div>
          <v-text-field
            v-model="appName"
            strong
            style="width: 10vw; min-width: 200px"
          />
        </div>
      </v-card>
      <v-card
        style="margin-top: 2em; padding: 1.5em 2em; gap: 1.2em"
        class="column"
        v-if="isConfigured || step >= 2"
        :style="step === 2 ? 'margin-bottom: 2em' : ''"
        :id="'configure-step-' + 2"
      >
        <h4 style="width: 100%; display: block">CHOOSE REGION</h4>
        <div class="flex flex-wrap" style="gap: 4vw">
          <div
            class="flex column"
            style="
              gap: 1.2em;
              align-items: flex-start;
              width: 22vw;
              min-width: 280px;
            "
          >
            <span class="body-1" style="color: var(--text-grey)">
              All assets stored by your application will be distributed across
              several storage nodes located at various physical locations across
              the world. Turn on specific regions only if your application needs
              these assets to be stored in storage nodes within a region.
            </span>
            <v-button variant="link" label="LEARN MORE" />
          </div>
          <div class="flex column" style="gap: 2em; flex-grow: 1">
            <v-card
              variant="depressed"
              class="flex"
              style="
                padding: 1.2em;
                width: calc(50% - 5em);
                min-width: 200px;
                justify-content: space-between;
              "
            >
              <span class="body-1">Anywhere</span>
              <v-switch v-model="location.any" />
            </v-card>
            <v-card
              variant="depressed"
              class="flex sm-column"
              style="padding: 1.2em; justify-content: space-between"
            >
              <div class="flex column flex-wrap" style="flex-grow: 1; gap: 1em">
                <div
                  class="flex"
                  style="justify-content: space-between; width: calc(100%)"
                >
                  <span class="body-1">Asia</span>
                  <v-switch v-model="location.asia" />
                </div>
                <div
                  class="flex"
                  style="justify-content: space-between; width: calc(100%)"
                >
                  <span class="body-1">Africa</span>
                  <v-switch v-model="location.africa" />
                </div>
                <div
                  class="flex"
                  style="justify-content: space-between; width: calc(100%)"
                >
                  <span class="body-1">Australia</span>
                  <v-switch v-model="location.australia" />
                </div>
              </div>
              <v-seperator
                :vertical="true"
                style="margin: 0 2em"
                class="mobile-remove"
              />
              <div
                class="flex column sm-column-gap"
                style="flex-grow: 1; gap: 1em"
              >
                <div
                  class="flex"
                  style="justify-content: space-between; width: calc(100%)"
                >
                  <span class="body-1">Europe</span>
                  <v-switch v-model="location.europe" />
                </div>
                <div
                  class="flex"
                  style="justify-content: space-between; width: calc(100%)"
                >
                  <span class="body-1">North America</span>
                  <v-switch v-model="location.northAmerica" />
                </div>
                <div
                  class="flex"
                  style="justify-content: space-between; width: calc(100%)"
                >
                  <span class="body-1">South America</span>
                  <v-switch v-model="location.southAmerica" />
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </v-card>
      <v-card
        style="margin-top: 2em; padding: 1.5em 2em; gap: 1.2em"
        class="column"
        v-if="isConfigured || step >= 3"
        :style="step === 3 ? 'margin-bottom: 2em' : ''"
        :id="'configure-step-' + 3"
      >
        <h4 style="width: 100%; display: block">CHOOSE CHAIN TYPE</h4>
        <div class="flex flex-wrap" style="gap: 4vw">
          <div
            class="flex column"
            style="
              gap: 1.2em;
              align-items: flex-start;
              width: 22vw;
              min-width: 280px;
            "
          >
            <span class="body-1" style="color: var(--text-grey)">
              If your application is being built for one or more of these
              blockchains, please specify the same by turning on the relevant
              chains.
            </span>
            <v-button variant="link" label="LEARN MORE" />
          </div>
          <div class="flex column" style="gap: 2em; flex-grow: 1">
            <v-card
              variant="depressed"
              class="flex column"
              style="
                padding: 1.2em;
                justify-content: space-between;
                gap: 1.2em;
                width: calc(50% - 6em);
                min-width: 200px;
              "
            >
              <div
                class="flex"
                style="justify-content: space-between; width: calc(100%)"
              >
                <span class="body-1">Ethereum</span>
                <v-switch v-model="chainTypes.ethereum" />
              </div>
              <div
                class="flex"
                style="justify-content: space-between; width: calc(100%)"
              >
                <span class="body-1">Polygon</span>
                <v-switch v-model="chainTypes.polygon" />
              </div>
              <div
                class="flex"
                style="justify-content: space-between; width: calc(100%)"
              >
                <span class="body-1">Binance</span>
                <v-switch v-model="chainTypes.binance" />
              </div>
            </v-card>
          </div>
        </div>
      </v-card>
      <v-card
        style="margin-top: 2em; padding: 1.5em 2em; gap: 1.2em"
        class="column"
        v-if="isConfigured || step >= 4"
        :style="step === 4 ? 'margin-bottom: 2em' : ''"
        :id="'configure-step-' + 4"
      >
        <h4 style="width: 100%; display: block">CHOOSE LOGIN TYPE</h4>
        <div class="flex flex-wrap" style="gap: 4vw">
          <div
            class="flex column"
            style="
              gap: 1.2em;
              align-items: flex-start;
              width: 22vw;
              min-width: 280px;
            "
          >
            <span class="body-1" style="color: var(--text-grey)">
              Your users can bring their own public and private keys or be
              assigned a pair of them upon registration through our trustless
              Distributed Key Generation system. These are ECDSA keys on the
              secp256k1 curve which work with any EVM compatible chains.
            </span>
            <v-button variant="link" label="LEARN MORE" />
          </div>
          <div class="flex column">
            <div
              class="flex sm-column"
              style="gap: 2em; align-items: flex-start"
            >
              <v-dropdown
                :options="authenticationTypes"
                placeholder="Authentication Type"
                style="width: calc(36% - 4em); min-width: 270px"
                v-model="selectedAuthenticationType"
              />
              <v-text-field
                v-if="selectedAuthenticationType !== 'Bring Your Own Keys'"
                placeholder="Enter Client ID"
                :icon="PlusIcon"
                v-model="selectedAuthClientId"
                @icon-clicked="addAuthentication"
                :clickableIcon="true"
                @keyup.enter="addAuthentication"
                :messageType="selectedAuthClientIdError ? 'error' : ''"
                message="Login type already added"
              />
            </div>
            <div class="flex flex-wrap" style="gap: 2em">
              <v-chip
                v-for="(authDetail, index) in authenticationDetails"
                :key="authDetail"
                :cancellable="true"
                @cancel="removeAuthentication(index)"
                style="
                  max-width: 240px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span class="body-1">
                  {{ authDetail.authType }} | {{ authDetail.clientId }}
                </span>
              </v-chip>
            </div>
          </div>
        </div>
      </v-card>
      <v-card
        style="
          margin-top: 2em;
          padding: 1.5em 2em;
          gap: 1.2em;
          margin-bottom: 2em;
        "
        class="column"
        v-if="isConfigured || step >= 5"
        :id="'configure-step-' + 5"
      >
        <h4 style="width: 100%; display: block">SET PER USER LIMIT</h4>
        <div class="flex flex-wrap" style="gap: 4vw">
          <div
            class="flex column"
            style="
              gap: 1.2em;
              align-items: flex-start;
              width: 22vw;
              min-width: 280px;
            "
          >
            <span class="body-1" style="color: var(--text-grey)">
              Your application’s limits will act as the default storage and
              bandwidth limits for each user of your application unless you
              choose to specify it for each user here.
            </span>
            <v-button variant="link" label="LEARN MORE" />
          </div>
          <div
            class="flex sm-column"
            style="gap: 3em; flex-grow: 1; align-items: flex-start"
          >
            <div class="flex column" style="flex-grow: 1; gap: 20px">
              <div
                class="flex sm-column"
                style="justify-content: space-between; width: calc(90%)"
              >
                <h3>STORAGE</h3>
                <div
                  class="flex sm-column-gap"
                  style="align-items: center; gap: 1em"
                >
                  <span class="body-2">Unlimited</span>
                  <v-switch
                    v-model="storageUnlimited"
                    style="margin-top: 2px"
                  />
                </div>
              </div>
              <div
                class="text-field flex"
                style="width: 90%; justify-content: space-between"
              >
                <input
                  type="number"
                  maxlength="1"
                  id="storage"
                  min="0"
                  pattern="[0-9]"
                />
                <v-dropdown
                  :options="['MB', 'GB']"
                  placeholder="unit"
                  class="usage"
                  style="min-width: 8em"
                  triggerStyle="padding: 18px 20px"
                />
              </div>
            </div>
            <div class="flex column" style="flex-grow: 1; gap: 20px">
              <div
                class="flex sm-column sm-column-gap"
                style="justify-content: space-between; width: calc(90%)"
              >
                <h3>BANDWIDTH</h3>
                <div
                  class="flex sm-column-gap"
                  style="align-items: center; gap: 1em"
                >
                  <span class="body-2">Unlimited</span>
                  <v-switch
                    v-model="bandwidthUnlimited"
                    style="margin-top: 2px"
                  />
                </div>
              </div>
              <div
                class="text-field flex"
                style="width: 90%; justify-content: space-between"
              >
                <input
                  type="number"
                  maxlength="1"
                  id="storage"
                  min="0"
                  pattern="[0-9]"
                />
                <v-dropdown
                  :options="['MB', 'GB']"
                  placeholder="unit"
                  class="usage"
                  style="min-width: 8em"
                  triggerStyle="padding: 18px 20px"
                />
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </main>
    <configure-footer
      v-if="!isConfigured"
      :show="!isConfigured"
      :saveLabel="step === 5 ? 'SAVE' : 'NEXT'"
      @save="onFooterSave"
      @cancel="onFooterCancel"
      :cancelLabel="step === 1 ? 'CANCEL' : 'PREVIOUS'"
    />
    <configure-footer
      v-else
      :show="isEdited"
      @save="isEdited = false"
      @cancel="isEdited = false"
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
            @click="deleteApp = false"
          />
          <v-button
            variant="primary"
            label="DELETE"
            v-wave
            @click="startDeleteTimer"
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
            <span class="sub-heading-2"
              >00:{{ timer.toString().padStart(2, "0") }}</span
            >
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
            @click="handleCancelDelete"
          />
          <v-button
            variant="primary"
            label="DELETE"
            v-wave
            @click="handleDelete"
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

.outer-clock-progress {
  width: 12em;
  height: 12em;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  overflow: hidden;
}

.configure-options {
  margin-left: auto;
}

progress::-webkit-progress-bar {
  background-color: transparent;
}
progress::-webkit-progress-value {
  background: #8fff00;
  border-radius: 999px;
  transition: width 0.4s;
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

<script>
import BackIcon from "../assets/iconography/back.svg";
import DeleteIcon from "../assets/iconography/delete.svg";
import PauseIcon from "../assets/iconography/pause.svg";
import PlusIcon from "../assets/iconography/plus.svg";
import { useRouter } from "vue-router";
import VSwitch from "../components/lib/VSwitch/VSwitch.vue";
import { ref } from "@vue/reactivity";
import VTextField from "../components/lib/VTextField/VTextField.vue";
import VCard from "../components/lib/VCard/VCard.vue";
import VButton from "../components/lib/VButton/VButton.vue";
import VSeperator from "../components/lib/VSeperator/VSeperator.vue";
import VDropdown from "../components/lib/VDropdown/VDropdown.vue";
import VOverlay from "../components/lib/VOverlay/VOverlay.vue";
import VTooltip from "../components/lib/VTooltip/VTooltip.vue";
import VChip from "../components/lib/VChip/VChip.vue";
import { onMounted, watch } from "@vue/runtime-core";
import ConfigureFooter from "../components/ConfigureFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import VIconButton from "../components/lib/VIconButton/VIconButton.vue";
import CircleProgress from "vue3-circle-progress";
import VCircularProgress from "../components/lib/VCircularProgress/VCircularProgress.vue";
export default {
  components: {
    VSwitch,
    VTextField,
    VCard,
    VButton,
    VSeperator,
    VDropdown,
    VTooltip,
    ConfigureFooter,
    AppHeader,
    VOverlay,
    VChip,
    VIconButton,
    CircleProgress,
    VCircularProgress,
  },
  setup() {
    const router = useRouter();
    const appName = ref("Aspire");
    let liveEnvironment = ref(false);
    let isConfigured = ref(false);
    let step = ref(1);
    let isEdited = ref(false);
    let deleteApp = ref(false);
    let proceedDelete = ref(false);
    let __locationCopy = {
      any: false,
      asia: false,
      africa: false,
      austrialia: false,
      europe: false,
      northAmerica: false,
      southAmerica: false,
    };
    let location = ref({ ...__locationCopy });
    let timer = ref(59);
    let progressTimer = ref(59000);

    let __chainTypesCopy = {
      ethereum: false,
      polygon: false,
      binance: false,
    };
    let chainTypes = ref({ ...__chainTypesCopy });

    let storageUnlimited = ref(false);
    let bandwidthUnlimited = ref(false);
    let selectedAuthenticationType = ref("");
    let selectedAuthClientId = ref("");
    const authenticationTypes = [
      "Bring Your Own Keys",
      "Google",
      "Github",
      "Reddit",
      "Discord",
      "Twitter",
      "Twitch",
    ];
    let authenticationDetails = ref([]);
    let selectedAuthClientIdError = ref(false);

    watch(
      () => location.value,
      () => {
        Object.keys(location.value).forEach((key) => {
          if (key !== "any") {
            if (location.value.any && !__locationCopy.any) {
              location.value[key] = false;
            } else if (
              location.value[key] &&
              !__locationCopy[key] &&
              location.value.any
            ) {
              location.value.any = false;
            }
          }
        });
        __locationCopy = { ...location.value };
        isEdited.value = true;
      },
      { deep: true }
    );

    watch(
      () => chainTypes.value,
      () => {
        isEdited.value = true;
      }
    );

    function backToDashboard() {
      router.back();
    }

    function addAuthentication() {
      console.log(selectedAuthenticationType.value, selectedAuthClientId.value);
      if (
        selectedAuthClientId.value.trim() &&
        selectedAuthenticationType.value
      ) {
        console.log("Here");
        const type =
          selectedAuthenticationType.value === "Bring Your Own Keys"
            ? "user-keys"
            : selectedAuthenticationType.value.toLowerCase();
        if (
          !authenticationDetails.value.find(
            (authDetail) => authDetail.type === type
          )
        ) {
          authenticationDetails.value.push({
            type,
            authType: selectedAuthenticationType.value,
            clientId: selectedAuthClientId.value.trim(),
          });
          selectedAuthClientId.value = "";
          selectedAuthenticationType.value = "";
        } else {
          selectedAuthClientIdError.value = true;
        }
      }
    }

    function removeAuthentication(index) {
      console.log("Remove", index);
      authenticationDetails.value.splice(index, 1);
      console.log(authenticationDetails.value);
    }

    function onFooterSave() {
      if (step.value < 6) step.value++;
      if (step.value <= 5) {
        setTimeout(() => {
          document
            .getElementById("configure-step-" + step.value)
            .scrollIntoView({ behavior: "smooth" });
        }, 10);
      } else if (step.value === 6) {
        step.value = 5;
        localStorage.setItem("isConfigured", "true");
        router.replace("/");
      }
    }

    function onFooterCancel() {
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
    }

    function handleDelete() {
      localStorage.clear();
      router.push("/");
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
      intervalForTimer = setInterval(timerInterval, 100);
      intervalForDelete = setInterval(deleteInterval, 1000);
    }

    function handleCancelDelete() {
      clearInterval(intervalForTimer);
      clearInterval(intervalForDelete);
      proceedDelete.value = false;
    }

    onMounted(() => {
      isConfigured.value = !!localStorage.getItem("isConfigured");
    });

    return {
      BackIcon,
      DeleteIcon,
      PauseIcon,
      PlusIcon,
      backToDashboard,
      liveEnvironment,
      appName,
      location,
      chainTypes,
      storageUnlimited,
      bandwidthUnlimited,
      authenticationTypes,
      selectedAuthenticationType,
      authenticationDetails,
      selectedAuthClientId,
      selectedAuthClientIdError,
      step,
      isConfigured,
      isEdited,
      deleteApp,
      proceedDelete,
      timer,
      progressTimer,
      onFooterSave,
      onFooterCancel,
      addAuthentication,
      removeAuthentication,
      handleDelete,
      startDeleteTimer,
      handleCancelDelete,
    };
  },
};
</script>