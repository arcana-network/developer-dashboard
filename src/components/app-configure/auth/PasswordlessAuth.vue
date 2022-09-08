<script setup lang="ts">
import { reactive, ref } from 'vue'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import constants from '@/utils/constants'
import { isValidUrl } from '@/utils/validation'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)
const isEdited = ref(false)

const passwordless = reactive({ ...app.auth.passwordless })

async function handleSave() {
  if (passwordless) {
    try {
      loaderStore.showLoader('Saving app name...')
      const { auth } = app
      auth.passwordless = passwordless
      await updateApp(appId, { ...app, ...auth })
      toast.success('Updated app name')
      app.auth.passwordless = passwordless
    } catch (e) {
      toast.error('Error occured while updating the passwordless credentials.')
    } finally {
      loaderStore.hideLoader()
    }
  }
}

function handleCancel() {
  const { javascriptOrigin, redirectUri } = app.auth.passwordless
  passwordless.javascriptOrigin = javascriptOrigin
  passwordless.redirectUri = redirectUri
}

function isValidJavascriptOrigin() {
  return isValidUrl(passwordless.javascriptOrigin as string)
}

function isValidRedirectUri() {
  return isValidUrl(passwordless.redirectUri as string)
}

function hasSameValuesInStore() {
  return (
    passwordless.javascriptOrigin === app.auth.passwordless.javascriptOrigin &&
    passwordless.redirectUri === app.auth.passwordless.redirectUri
  )
}
</script>

<template>
  <section name="passwordless-auth">
    <SettingCard>
      <template #title>Passwordless Auth</template>
      <template #description>
        Offer dApp users the convenience of authentication by simply clicking on
        links sent to their chosen email address, instead of having to remember
        passwords.
        <br />
        <a
          :href="`${constants.DOCS_URL}/docs/pwdless`"
          target="_blank"
          class="learn-more"
        >
          Learn More...
        </a>
      </template>
      <form @submit.prevent="handleSave">
        <VStack direction="column" gap="1rem" class="flex-grow">
          <VStack
            direction="row"
            align="center"
            sm-direction="column"
            sm-align="start"
            gap="1rem"
          >
            <label for="passwordless-javascript-origin"
              >JavaScript Origin</label
            >
            <VTextField
              id="passwordless-javascript-origin"
              v-model="passwordless.javascriptOrigin"
              class="passwordless-input"
              :message-type="
                isEdited &&
                passwordless.redirectUri &&
                !isValidJavascriptOrigin()
                  ? 'error'
                  : ''
              "
              message="Invalid javascript origin - must be a valid url"
              @blur="isEdited = true"
            />
          </VStack>
          <VStack
            direction="row"
            align="center"
            sm-direction="column"
            sm-align="start"
            gap="1rem"
          >
            <label for="passwordless-redirect-uri">Redirect URI</label>
            <VTextField
              id="passwordless-redirect-uri"
              v-model="passwordless.redirectUri"
              class="passwordless-input"
              :message-type="
                isEdited &&
                passwordless.javascriptOrigin &&
                !isValidRedirectUri()
                  ? 'error'
                  : ''
              "
              message="Invalid redirect uri - must be a valid url"
              @blur="isEdited = true"
            />
          </VStack>
          <ConfigureActionButtons
            :save-disabled="
              !isValidJavascriptOrigin() ||
              !isValidRedirectUri() ||
              hasSameValuesInStore()
            "
            :cancel-disabled="hasSameValuesInStore()"
            @cancel="handleCancel"
          />
        </VStack>
      </form>
    </SettingCard>
  </section>
</template>

<style scoped>
label {
  width: 10rem;
  margin-top: -2rem;
}

.passwordless-input {
  width: 100%;
  max-width: 40rem;
}
</style>
