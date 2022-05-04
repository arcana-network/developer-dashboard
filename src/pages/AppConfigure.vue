<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import CircleProgress from 'vue3-circle-progress'
import { useStore } from 'vuex'

import CloseIcon from '@/assets/iconography/close.svg'
import DeleteIcon from '@/assets/iconography/delete.svg'
import ConfigureAppAuth from '@/components/app-configure/AppAuth.vue'
import ConfigureAppChainType from '@/components/app-configure/AppChain.vue'
import ConfigureAppName from '@/components/app-configure/AppName.vue'
import ConfigureAppRegion from '@/components/app-configure/AppRegion.vue'
import ConfigureUserLimits from '@/components/app-configure/AppUserLimits.vue'
import AppHeader from '@/components/AppHeader.vue'
import ConfigureFooter from '@/components/ConfigureFooter.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VIconButton from '@/components/lib/VIconButton/VIconButton.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import appConfigService from '@/services/app-config.service'
import useArcanaAuth from '@/use/arcanaAuth'
import cryptoUtils from '@/utils/cryptoUtils'
import signerMakeTx from '@/utils/signerMakeTx'

const router = useRouter()
const store = useStore()
const arcanaAuth = useArcanaAuth()

let isConfigured = computed(() => {
  return store.getters.isAppConfigured
})
let step = ref(1)
let deleteApp = ref(false)
let proceedDelete = ref(false)
let timer = ref(59)
let progressTimer = ref(59000)
let showLearnMorePopup = computed(() => {
  return store.getters.showLearnMorePopup
})
let selectedSubType = computed(() => {
  return store.getters.configDetails
})
let loading = ref(false)
let loadingMessage = ref('')
let isPrivateKeyDecrypted = ref(true)
let password = ref('')
let passwordMessage = ref('')
let passwordMessageType = ref('')
let userLimitError = false

const previousConfig = {
  appName: store.getters.appName,
  ...store.getters['test/config'],
}

const env = computed(() => {
  return store.getters.env
})

let testConfig = {
  region: store.getters['test/region'],
  chainType: store.getters['test/chainType'],
  authDetails: store.getters['test/authDetails'],
  userLimits: store.getters['test/userLimits'],
}

const isEdited = computed(() => {
  return store.getters.onConfigChange
})

if (!store.getters.keys.privateKey) {
  const encryptedPrivateKey = localStorage.getItem('private-key')
  if (arcanaAuth.isLoggedIn()) {
    const { privateKey, userInfo } = arcanaAuth.getUserInfo()
    store.dispatch('updateKeys', { privateKey })
    store.dispatch('updateUserInfo', {
      name: userInfo.name,
      email: userInfo.id,
    })
  } else if (encryptedPrivateKey) {
    isPrivateKeyDecrypted.value = false
  } else {
    router.push({ name: 'Login' })
  }
}

function backToDashboard() {
  resetSettings()
  router.push('/')
}

async function onFooterSave() {
  if (!isConfigured.value) {
    if (step.value < 6) step.value++
    if (step.value <= 5) {
      setTimeout(() => {
        document
          .getElementById('configure-step-' + step.value)
          .scrollIntoView({ behavior: 'smooth' })
      }, 10)
    } else if (step.value === 6) {
      step.value = 5

      if (!store.getters.appName?.trim()) {
        store.dispatch('updateAppNameError', true)
        document.getElementById('app').scroll({ top: 0, behavior: 'smooth' })
      } else {
        store.dispatch('updateAppNameError', false)
      }

      if (!store.getters.appNameError) {
        loading.value = true
        loadingMessage.value = 'Creating app...'
        appConfigService
          .createApp({
            name: store.getters.appName,
            ...store.getters[env.value + '/config'],
          })
          .then((response) => {
            const appAddress = response.data.app?.address
            store.dispatch('updateSmartContractAddress', appAddress)
            loading.value = false
            router.push('/')
          })
      }
    }
  } else {
    if (!store.getters.appName?.trim()) {
      store.dispatch('updateAppNameError', true)
      document.getElementById('app').scroll({ top: 0, behavior: 'smooth' })
      return
    } else {
      store.dispatch('updateAppNameError', false)
    }
    if (userLimitError) {
      document
        .getElementById('configure-step-5')
        .scrollIntoView({ top: 0, behavior: 'smooth' })
      return
    }
    const config = { ...store.getters[env.value + '/config'] }
    loading.value = true
    loadingMessage.value = 'Updating app...'
    await appConfigService.updateApp(store.getters.appId, {
      name: store.getters.appName,
      address: store.getters.smartContractAddress,
      ...config,
    })
    const authToRemove = [...store.getters[env.value + '/authToRemove']]
    if (authToRemove.length) {
      const authToRemovePromises = authToRemove.map((el) =>
        appConfigService.deleteCred(el)
      )
      await Promise.all(authToRemovePromises)
      store.dispatch(env.value + '/clearAuthToRemove')
    }
    store.dispatch('configChangeReset')
    makeTx()
  }
}

async function makeTx() {
  const config = { ...store.getters[env.value + '/config'] }

  if (store.getters.appName !== previousConfig.appName) {
    loadingMessage.value = `Updating app name in smart contract...`
    await signerMakeTx('setAppName', [store.getters.appName])
  }

  const authDetails = [...store.getters[store.getters.env + '/authDetails']]
  const authSignerMakeTxValue = [[], []]

  authDetails.forEach((authDetail) => {
    if (authDetail.verifier !== 'passwordless') {
      authSignerMakeTxValue[0].push(authDetail.verifier)
      authSignerMakeTxValue[1].push(authDetail.clientId)
    }
  })
  await signerMakeTx('setClientIds', authSignerMakeTxValue)

  if (
    config.storage_limit !== previousConfig.storage_limit ||
    config.bandwidth_limit !== previousConfig.bandwidth_limit
  ) {
    loadingMessage.value = `Updating user limits in smart contract...`
    await signerMakeTx('setDefaultLimit', [
      config.storage_limit,
      config.bandwidth_limit,
    ])
  }

  loading.value = false
  router.push('/')
}

function onFooterCancel() {
  if (!isConfigured.value) {
    if (step.value > 0) step.value--
    if (step.value >= 1) {
      setTimeout(() => {
        document
          .getElementById('configure-step-' + step.value)
          .scrollIntoView({ behavior: 'smooth' })
      }, 10)
    } else if (step.value === 0) {
      router.push('/')
    }
  } else {
    resetSettings()
    router.push('/')
  }
}

function resetSettings() {
  store.dispatch('updateAppName', previousConfig.appName)
  updateEnvConfig('test', testConfig)
  store.dispatch('configChangeReset')
}

function updateEnvConfig(envValue, envConfig) {
  store.dispatch(envValue + '/updateRegion', envConfig.region)
  store.dispatch(envValue + '/updateChainType', envConfig.chainType)
  store.dispatch(envValue + '/updateAuthToRemove', [])
  store.dispatch(envValue + '/updateAuthDetails', envConfig.authDetails)
  store.dispatch(envValue + '/updateUserLimits', envConfig.userLimits)
}

function handleDelete() {
  appConfigService.deleteApp().then(() => {
    clearInterval(intervalForTimer)
    clearInterval(intervalForDelete)
    store.dispatch('test/resetConfigStore')
    store.dispatch('resetStore')
    router.push('/')
  })
}

let intervalForDelete
function deleteInterval() {
  timer.value = timer.value - 1
  if (timer.value === 0) {
    handleDelete()
  }
}

let intervalForTimer
function timerInterval() {
  progressTimer.value = progressTimer.value - 100
  if (progressTimer.value === 0) {
    clearInterval(intervalForTimer)
  }
}

function startDeleteTimer() {
  deleteApp.value = false
  proceedDelete.value = true
  timer.value = 59
  progressTimer.value = 59000
  console.log('Delete started')
  intervalForTimer = setInterval(timerInterval, 100)
  intervalForDelete = setInterval(deleteInterval, 1000)
}

function handleCancelDelete() {
  clearInterval(intervalForTimer)
  clearInterval(intervalForDelete)
  proceedDelete.value = false
}

function hideLearnMorePopup() {
  store.dispatch('hideLearnMorePopup')
}

function onForgotPassword() {
  localStorage.clear()
  store.dispatch('test/resetConfigStore')
  store.dispatch('resetAuth')
  store.dispatch('resetStore')
  router.push({ name: 'Login' })
}

async function onConfirmPassword() {
  passwordMessage.value = ''
  passwordMessageType.value = ''
  if (password.value) {
    try {
      const privateKey = await cryptoUtils.decrypt(
        localStorage.getItem('private-key'),
        password.value
      )
      store.dispatch('updateKeys', { privateKey })
      isPrivateKeyDecrypted.value = true
    } catch (e) {
      passwordMessage.value = 'Incorrect password'
      passwordMessageType.value = 'error'
    }
  } else {
    passwordMessage.value = 'Enter password to continue'
    passwordMessageType.value = 'error'
  }
}

function onUserLimitValueChange(ev) {
  userLimitError = ev.state === 'error'
}
</script>

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
        v-if="isConfigured"
        class="flex flex-wrap"
        style="align-items: center"
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
            <span class="body-1" style="color: var(--text-grey)">
              TestNet
            </span>
            <v-switch variant="secondary" disabled style="margin-top: 1px" />
            <span class="body-1" style="color: var(--text-grey)">
              MainNet
            </span>
          </v-stack>
          <div style="margin-left: auto">
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
        :is-configured="isConfigured"
        @enter-click="step = 2"
      />
      <configure-app-region
        v-if="isConfigured || step >= 2"
        :style="step === 2 ? 'margin-bottom: 2em' : ''"
        :is-configured="isConfigured"
      />
      <configure-app-chain-type
        v-if="isConfigured || step >= 3"
        :style="step === 3 ? 'margin-bottom: 2em' : ''"
        :is-configured="isConfigured"
      />
      <configure-app-auth
        v-if="isConfigured || step >= 4"
        :style="step === 4 ? 'margin-bottom: 2em' : ''"
        :is-configured="isConfigured"
      />
      <configure-user-limits
        v-if="isConfigured || step >= 5"
        style="margin-bottom: 8em"
        :is-configured="isConfigured"
        @value-change="onUserLimitValueChange"
      />
    </main>
    <configure-footer
      v-if="!isConfigured || isEdited"
      :save-label="isConfigured || step === 5 ? 'SAVE' : 'NEXT'"
      :cancel-label="isConfigured || step === 1 ? 'CANCEL' : 'PREVIOUS'"
      @save="onFooterSave"
      @cancel="onFooterCancel"
    />

    <v-overlay
      v-if="showLearnMorePopup"
      style="display: flex; align-items: center; justify-content: center"
    >
      <v-card
        variant="popup"
        style="
          position: relative;
          flex-direction: column;
          gap: 1vh;
          width: 72%;
          min-width: 200px;
          max-width: 700px;
          padding: 4em 2em;
        "
      >
        <header class="sub-heading-2" style="display: flex; flex-grow: 1">
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
      style="display: flex; align-items: center; justify-content: center"
    >
      <v-card
        variant="popup"
        style="
          flex-direction: column;
          gap: 1vh;
          width: 72%;
          min-width: 200px;
          max-width: 560px;
          padding: 4em 2em;
        "
      >
        <header
          class="sub-heading-1"
          style="display: flex; flex-grow: 1; justify-content: center"
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
            flex-grow: 1;
            gap: 2vh;
            align-items: center;
            justify-content: center;
          "
        >
          <v-button
            v-wave
            variant="secondary"
            label="CANCEL"
            style="border: 3px solid #28c6fa"
            @click.stop="deleteApp = false"
          />
          <v-button
            v-wave
            variant="primary"
            label="DELETE"
            :action="startDeleteTimer"
          />
        </footer>
      </v-card>
    </v-overlay>

    <v-overlay
      v-if="proceedDelete"
      style="display: flex; align-items: center; justify-content: center"
    >
      <v-card
        variant="popup"
        style="
          flex-direction: column;
          gap: 1vh;
          width: 72%;
          min-width: 200px;
          max-width: 560px;
          padding: 4vh 2em;
        "
      >
        <header
          class="sub-heading-1"
          style="display: flex; flex-grow: 1; justify-content: center"
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
              00:{{ timer.toString().padStart(2, '0') }}
            </span>
          </div>
        </div>
        <footer
          class="flex sm-column"
          style="
            flex-grow: 1;
            gap: 2vh;
            align-items: center;
            justify-content: center;
          "
        >
          <v-button
            v-wave
            variant="secondary"
            label="CANCEL"
            style="border: 3px solid #28c6fa"
            @click.stop="handleCancelDelete"
          />
          <v-button
            v-wave
            variant="primary"
            label="CONFIRM"
            @click.stop="handleDelete"
          />
        </footer>
      </v-card>
    </v-overlay>

    <v-overlay
      v-if="!isPrivateKeyDecrypted"
      style="display: flex; align-items: center; justify-content: center"
    >
      <v-card variant="popup" class="popup-card">
        <h4>Enter Password to decrypt private key</h4>
        <v-text-field
          id="password"
          v-model="password"
          label="Enter password"
          type="password"
          placeholder="Enter Here"
          name="password"
          style="width: 100%"
          :message-type="passwordMessageType"
          :message="passwordMessage"
        />
        <v-button label="Confirm" :action="onConfirmPassword" />
        <v-button
          variant="link"
          label="Forgot Password?"
          style="align-self: center; margin-top: 1em"
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
  top: 1em;
  right: 1em;
  cursor: pointer;
}

.step-counter {
  top: 50%;
  left: 50%;
  color: #13a3fd;
  transform: translate(-50%, -50%);
}

.app-action {
  padding: 0.8em;
  margin-left: 1vw;
}

.outer-clock {
  position: relative;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  margin: 3em 0;
  background: #000;
  border-radius: 50%;
  box-shadow: inset 0 -13px 33px -10px rgb(255 255 255 / 15%),
    inset 0 10px 53px 72px #090909;
}

.configure-options {
  margin-left: auto;
}

.first-time-configure-header {
  position: sticky;
  top: 0;
  z-index: 9999;
  padding: 2vh 2vw;
  background: #1f1f1f;
  box-shadow: 0 9px 25px rgb(15 15 15 / 25%);
}

.first-time-configure-header .container {
  margin: 0 auto;
}

.inner-clock {
  position: absolute;
  z-index: 1;
  align-items: center;
  justify-content: center;
  width: 94%;
  height: 94%;
  background: linear-gradient(
    45.51deg,
    #000 -78.45%,
    rgb(31 31 31 / 29%) 88.21%
  );
  border-radius: 50%;
  box-shadow: 5px 5px 10px rgb(0 0 0 / 18%),
    10px 10px 17px -4px rgb(10 10 10 / 50%),
    -8px -8px 20px -2px rgb(255 255 255 / 6%),
    inset 5px 5px 30px 8px rgb(32 32 32 / 6%);
}

.form-group {
  width: 50%;
  min-width: 280px;
}

div.text-field {
  background: linear-gradient(141.48deg, #1a1a1a -4.56%, #151515 135.63%);
  border-radius: 10px;
  box-shadow: inset -2px -2px 4px rgb(57 57 57 / 44%),
    inset 5px 5px 10px rgb(11 11 11 / 50%);
}

input {
  flex-grow: 1;
  width: 2em;
  padding: 15px 20px;
  margin: 0;
  font-family: var(--font-body);
  font-size: 1.25em;
  line-height: 1.5em;
  color: var(--text-white);
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;

  --webkit-outline: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

input[type='number'] {
  appearance: textfield;
}

.usage .custom-select__trigger {
  padding: 20px;
}

@media only screen and (max-width: 767px) {
  h1 {
    font-size: 2em;
  }

  .configure-options {
    flex-grow: 1;
    align-items: center;
    margin-top: 1em;
    margin-left: 0;
  }
}

.popup-card {
  flex-direction: column;
  gap: 1vh;
  width: max-content;
  padding: 4em;
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
