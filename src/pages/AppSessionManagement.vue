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
      <p class="font-body text-[16px] text-liquiddark leading-[150%]">
        Manage user authentication and session security.
        <a
          href="https://docs.arcana.network/concepts/session_type/"
          target="_blank"
        >
          Learn More
        </a>
      </p>
    </div>
  </div>
  <SettingCard>
    <template #title
      ><h2>
        Session Cookie Mode <span class="text-liquidred">*</span>
      </h2></template
    >
    <div class="flex flex-row gap-10">
      <div
        :class="{
          'disabled-card gradient-border-card': app.keyspace === 'global',
        }"
      >
        <VCard
          variant="depressed"
          class="rounded-md p-8 h-[30vh] max-w-sd bg-liquidlight cursor-pointer"
          @click.stop="selectedSession = true"
        >
          <VStack direction="row" gap="1.25rem" align="start">
            <input
              id="true"
              type="radio"
              value="true"
              :checked="selectedSession === true"
              :disabled="app.keyspace === 'global'"
              @change="selectedSession = true"
            />
            <VStack direction="column" gap="10px">
              <span class="text-base font-medium">Persistent Session</span>
              <span class="w-full text-sm text-liquiddark"
                >The authenticated session remains valid within a specified time
                period, so users don't need to log in again after closing and
                reopening the browser.</span
              >
            </VStack>
          </VStack>
        </VCard>
      </div>

      <VCard
        variant="depressed"
        class="rounded-md p-8 h-[30vh] max-w-sd bg-liquidlight cursor-pointer"
        @click.stop="selectedSession = false"
      >
        <VStack direction="row" gap="1.25rem" align="start">
          <input
            id="false"
            type="radio"
            value="false"
            :checked="selectedSession == false"
            @change="selectedSession = false"
          />
          <VStack direction="column" gap="10px">
            <span class="text-base font-medium">Non-Persistent Session</span>
            <span class="w-full text-sm text-liquiddark">
              If the browser is closed, the authenticated session is
              invalidated. Users must log in again to continue using the
              app.</span
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
  <SettingCard>
    <template #title><h2>Require Log In After*</h2></template>
    <template #description>
      <div>
        Specify the session duration in minutes after the browser is closed.
        Users will be automatically logged out when this time period expires.
      </div>
    </template>
    <span>Minutes</span>
    <VTextFieldSecondary
      v-model="sessionAge"
      type="number"
      class="max-w-sm"
      :class="{
        'disabled-text': selectedSession === false,
      }"
      :icon="sessionAge ? CloseIcon : ''"
      clickable-icon
      placeholder="Enter Minutes"
      :disabled="!selectedSession"
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
.gradient-border-card {
  padding: 2px;
  background: var(--primary-dark);
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
</style>
