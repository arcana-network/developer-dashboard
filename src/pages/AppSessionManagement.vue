<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextFieldSecondary from '@/components/lib/VTextFieldSecondary/VTextFieldSecondary.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { content, errors } from '@/utils/content'

const route = useRoute()
const toast = useToast()
const loaderStore = useLoaderStore()
const appId = Number(route.params.appId)
const appsStore = useAppsStore()
const app = appsStore.app(appId)
const isEdited = ref(false)
const selectedSession = ref(app.session_persisted)
let preSelectedSession = ref(app.session_persisted)
const sessionAge = ref(app.session_max_age)
let preSessionAge = ref(app.session_max_age)

async function handleSave() {
  try {
    loaderStore.showLoader(content.SESSION.SAVING)
    await updateApp(
      app.id,
      { session_persisted: selectedSession.value },
      app.network
    )
    app.session_persisted = selectedSession.value
    preSelectedSession.value = selectedSession.value
    toast.success(content.SESSION.SUCCESS)
  } catch (e) {
    console.error(e)
    toast.error(errors.SESSION_ERROR)
  } finally {
    loaderStore.hideLoader()
  }
}

async function handleMinuteSave() {
  try {
    loaderStore.showLoader(content.SESSION.SAVING)
    await updateApp(
      app.id,
      { session_max_age: Number(sessionAge.value) },
      app.network
    )
    app.session_max_age = sessionAge.value
    preSessionAge.value = sessionAge.value
    toast.success(content.SESSION.SUCCESS)
  } catch (e) {
    console.error(e)
    toast.error(errors.SESSION_ERROR)
  } finally {
    loaderStore.hideLoader()
  }
}

function handleCancel() {
  selectedSession.value = preSelectedSession.value
}
function handleMinuteCancel() {
  sessionAge.value = preSessionAge.value
}

function clearSessionAge() {
  sessionAge.value = 0
}
</script>

<template>
  <div class="space-y-10 relative">
    <div class="space-y-[15px]">
      <h1>Login Session Management</h1>
      <p class="font-body text-[14px] text-liquiddark leading-[150%]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Lectus magna
        fringilla urna porttitor rhoncus dolor purus non.
      </p>
    </div>
  </div>
  <SettingCard class="app-branding-card">
    <template #title><h2>Session Cookie Mode*</h2></template>
    <template #description>
      <div>
        Provide your users the convenience of using magic links delivered to
        their email addresses that they can click on to authenticate themselves
        instead of using passwords.
        <a
          href="https://docs.dev.arcana.network/concepts/sharedkeys.html"
          target="_blank"
        >
          Learn More
        </a>
      </div>
    </template>
    <div class="flex flex-row gap-10">
      <VCard variant="depressed" class="keyspace-card keyspace-container">
        <VStack direction="row" gap="1.25rem" align="start">
          <input
            id="true"
            type="radio"
            value="true"
            :checked="selectedSession === true"
            @change="selectedSession = true"
          />
          <VStack direction="column" gap="10px">
            <span class="card-title">Persistent Session</span>
            <span class="card-description"
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam ut
              fermentum, bibendum lectus phasellus ligula morbi.</span
            >
          </VStack>
        </VStack>
      </VCard>
      <VCard variant="depressed" class="keyspace-card keyspace-container">
        <VStack direction="row" gap="1.25rem" align="start">
          <input
            id="false"
            type="radio"
            value="false"
            :checked="selectedSession == false"
            @change="selectedSession = false"
          />
          <VStack direction="column" gap="10px">
            <span class="card-title">Non-Persistent Session</span>
            <span class="card-description"
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam ut
              fermentum, bibendum lectus phasellus ligula morbi.</span
            >
          </VStack>
        </VStack>
      </VCard>
    </div>
    <ConfigureActionButtons
      :save-disabled="selectedSession === preSelectedSession"
      :cancel-disabled="selectedSession === preSelectedSession"
      @cancel="handleCancel"
      @save="handleSave"
    />
  </SettingCard>
  <SettingCard class="app-branding-card">
    <template #title><h2>Require Log In After*</h2></template>
    <template #description>
      <div>
        Provide your users the convenience of using magic links delivered to
        their email addresses that they can click on to authenticate themselves
        instead of using passwords.
        <a
          href="https://docs.dev.arcana.network/concepts/sharedkeys.html"
          target="_blank"
        >
          Learn More
        </a>
      </div>
    </template>
    <span>Minutes</span>
    <VTextFieldSecondary
      v-model="sessionAge"
      type="number"
      class="web-wallet-input"
      :icon="sessionAge ? CloseIcon : ''"
      clickable-icon
      placeholder="Enter Minutes"
      @icon-clicked="clearSessionAge()"
      @blur="isEdited = true"
    />
    <ConfigureActionButtons
      :save-disabled="sessionAge === preSessionAge"
      :cancel-disabled="sessionAge === preSessionAge"
      @cancel="handleMinuteCancel"
      @save="handleMinuteSave"
    />
  </SettingCard>
</template>

<style scoped>
.keyspace-card {
  width: 100%;
  max-width: 360px;
  height: 30vh;
  cursor: pointer;
}

.circle-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.keyspace-container {
  max-width: 350px;
  padding: 2rem;
  background-color: var(--color-white);
  border-radius: 5px;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.card-description {
  width: 100%;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-grey);
}

.gradient-border-card {
  padding: 2px;
  background: var(--secondary);
  border-radius: 10px;
  opacity: 100;
}

.disabled-card {
  cursor: not-allowed;
  opacity: 0.4;
}

input[type='radio'] {
  display: grid;
  place-content: center;
  width: 20px;
  background: #fff;
  border: #000 solid 2px;
  border-radius: 50%;
  box-shadow: none;
  transform: translateX(0);
  appearance: none;
}

input[type='radio']::before {
  width: 16px;
  height: 16px;
  content: '';
  background: #000;
  border: #fff solid 2px;
  border-radius: 50%;
  transition: 120ms transform ease-in-out;
  transform: scale(0);
}

input[type='radio']:checked::before {
  transform: scale(1);
}

.bolder {
  font-weight: bolder;
}

.web-wallet-input {
  max-width: 24rem;
}
</style>
