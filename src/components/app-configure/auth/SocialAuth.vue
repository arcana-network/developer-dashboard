<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { deleteCred, updateApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import {
  socialLogins,
  DOCS_URL,
  isProductionDashboard,
} from '@/utils/constants'
import type { SocialAuthVerifier } from '@/utils/constants'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)
const selectedCredentialInput: Ref<SocialAuthVerifier> = ref('aws')

const appNetwork = isProductionDashboard
  ? app.network
  : app.network === 'mainnet'
  ? 'testnet'
  : 'dev'

const socialAuth = socialLogins
  .filter((el) => (appNetwork === 'dev' ? true : el.verifier !== 'firebase'))
  .filter((el) => (isProductionDashboard ? el.verifier !== 'steam' : true))
  .map((login) => {
    const auth = app.auth.social.find((el) => el.verifier === login.verifier)
    if (auth) {
      return {
        ...login,
        ...auth,
        error: '',
      }
    }
    return { ...login, error: '' }
  })

const socialAuthRef = reactive(socialAuth)

function isAuthValid(auth: typeof socialAuth[0]) {
  if (auth.hasClientSecret && auth.verifier !== 'steam') {
    if (!auth.clientId?.length && auth.clientSecret?.length) {
      auth.error = 'Client Id is required'
      return false
    }
    if (!auth.clientSecret?.length && auth.clientId?.length) {
      auth.error =
        auth.verifier === 'aws'
          ? 'User Pool URL is required'
          : 'Client secret is required'
      return false
    }
  }
  auth.error = ''
  return true
}

function hasError() {
  return socialAuthRef.some((el) => el.error)
}

function hasSameValuesInStore() {
  for (const auth of socialAuthRef) {
    const authInStore = app.auth.social.find(
      (el) => el.verifier === auth.verifier
    )
    if (
      authInStore?.clientId !== auth.clientId ||
      authInStore?.clientSecret !== auth.clientSecret
    ) {
      return false
    }
  }
  return true
}

function handleCancel() {
  socialAuthRef.forEach((authRef) => {
    const auth = app.auth.social.find((el) => el.verifier === authRef.verifier)
    authRef.clientId = auth?.clientId
    authRef.clientSecret = auth?.clientSecret
    authRef.error = ''
  })
}

async function handleSave() {
  try {
    loaderStore.showLoader('Saving social auth credentials...')
    const { auth } = app
    const social = socialAuthRef
      .map((authRef) => {
        if (
          authRef.verifier === 'steam' &&
          selectedCredentialInput.value === 'steam'
        )
          authRef.clientId = app.address
        const { verifier, clientId, clientSecret } = authRef
        return { verifier, clientId, clientSecret }
      })
      .filter((auth) => !!auth.clientId)
    const authToRemove = auth.social.filter((a) => {
      return !social.find((s) => s.verifier === a.verifier)
    })
    auth.social = social
    await updateApp(appId, { auth }, app.network)
    await deleteCred(appId, authToRemove, app.network)
    toast.success('Saved social auth credentials')
    app.auth.social = [...social]
  } catch (e) {
    toast.error('Error occured while saving the social auth.')
  } finally {
    loaderStore.hideLoader()
  }
}

function handleInputDelete(
  auth: typeof socialAuth[0],
  key: 'clientId' | 'clientSecret'
) {
  if (!auth[key]) {
    delete auth[key]
  }
}

function isAWSSelected() {
  return selectedCredentialInput.value === 'aws'
}

function isAuthActive(verifier: SocialAuthVerifier) {
  const auth =
    socialAuthRef.find((auth) => auth.verifier === verifier) || socialAuthRef[0]
  if (auth.hasClientSecret) {
    return !auth.clientId?.length || !auth.clientSecret?.length
  } else return !auth.clientId?.length
}

function showCognitoNote() {
  return ['aws', 'google'].includes(selectedCredentialInput.value)
}

function showSteamNote() {
  return ['steam'].includes(selectedCredentialInput.value)
}
</script>

<template>
  <section name="social-auth">
    <SettingCard>
      <template #title>Social Auth</template>
      <template #description>
        Select the social login provider for onboarding app users by specifying
        authentication verification details.
        <a :href="`${DOCS_URL}/howto/config_social/index.html`" target="_blank">
          READ MORE
        </a>
        <p v-if="showCognitoNote()" class="mt-3">
          <strong>Note:</strong> If you enable Cognito as one of the multiple
          onboarding options then you can directly configure Google login
          through Cognito itself instead of using Arcana Dashboard.
        </p>
        <p v-if="showSteamNote()" class="mt-3">
          <strong>Note:</strong> When you are a Steam member, and have already
          spent more than 5.00 USD in the store you should be able to request
          your Steam API Key.
        </p>
      </template>
      <form @submit.prevent="handleSave">
        <div class="flex space-x-2 divide-x-[1px] divide-[#8d8d8d33]">
          <div class="space-y-2.5">
            <button
              v-for="auth in socialAuthRef"
              :key="`social-login-${auth.verifier}`"
              :for="auth.verifier"
              class="text-lg font-normal w-14 flex flex-col items-center bg-transparent border-none outline-none"
              @click.prevent="() => (selectedCredentialInput = auth.verifier)"
            >
              <div
                class="logo"
                :class="{
                  'logo--active': selectedCredentialInput === auth.verifier,
                }"
              >
                <img
                  :src="auth.icon"
                  class="logo-img"
                  :class="{
                    'logo-img--inactive': isAuthActive(auth.verifier),
                  }"
                />
              </div>
              <p class="auth-label">{{ auth.name }}</p>
            </button>
          </div>
          <div class="w-full pl-4">
            <div v-for="auth in socialAuthRef" :key="auth.verifier">
              <div class="social-auth-input__container">
                <VStack
                  v-if="selectedCredentialInput === auth.verifier"
                  gap="1rem"
                  class="social-auth-input-field__container"
                >
                  <VStack
                    v-if="auth.verifier !== 'steam'"
                    class="social-auth-input__wrapper"
                  >
                    <div class="flex justify-between space-x-2">
                      <p
                        v-if="auth.verifier === 'firebase'"
                        class="input-label"
                      >
                        Project ID
                      </p>
                      <p v-else class="input-label">Client ID</p>
                      <a
                        class="input-doc-link"
                        :href="auth.documentation"
                        target="_blank"
                      >
                        <span v-if="auth.verifier === 'firebase'"
                          >Get your Project ID</span
                        >
                        <span v-else>Get your Client ID</span>
                      </a>
                    </div>
                    <VTextField
                      :id="auth?.verifier"
                      v-model.trim="auth.clientId"
                      no-message
                      class="social-auth-input"
                      placeholder="Client ID"
                      @keyup.delete="handleInputDelete(auth, 'clientId')"
                    ></VTextField>
                  </VStack>
                  <VStack
                    v-if="auth.hasClientSecret"
                    class="social-auth-input__wrapper"
                  >
                    <div class="flex justify-between space-x-2">
                      <p v-if="isAWSSelected()" class="input-label">
                        Cognito User Pool Domain
                      </p>
                      <p
                        v-else-if="auth.verifier === 'steam'"
                        class="input-label"
                      >
                        Steam API Key
                      </p>
                      <p v-else class="input-label">Client Secret</p>
                      <a
                        class="input-doc-link"
                        :href="
                          auth.verifier === 'aws'
                            ? auth.userPoolDomainDoc
                            : auth.documentation
                        "
                        target="_blank"
                      >
                        <span v-if="isAWSSelected()"
                          >Get your User Pool Domain</span
                        >
                        <span v-else-if="auth.verifier === 'steam'"
                          >Get your Steam API key</span
                        >
                        <span v-else>Get your Client Secret</span>
                      </a>
                    </div>
                    <VTextField
                      v-model.trim="auth.clientSecret"
                      no-message
                      class="social-auth-input"
                      :placeholder="
                        isAWSSelected()
                          ? 'Enter the domain without https://'
                          : auth.verifier === 'steam'
                          ? 'Steam API Key'
                          : 'Client Secret'
                      "
                      @keyup.delete="handleInputDelete(auth, 'clientSecret')"
                    ></VTextField>
                  </VStack>
                </VStack>
              </div>
              <VStack gap="1.5rem">
                <span
                  v-show="
                    !isAuthValid(auth) &&
                    auth.verifier === selectedCredentialInput
                  "
                  class="text-lg font-normal error-message"
                >
                  {{ auth.error }}
                </span>
              </VStack>
            </div>
            <ConfigureActionButtons
              :save-disabled="hasError() || hasSameValuesInStore()"
              :cancel-disabled="hasSameValuesInStore()"
              @cancel="handleCancel"
            />
          </div>
        </div>
      </form>
    </SettingCard>
  </section>
</template>

<style scoped>
.seperator {
  border: 1px solid #8d8d8d33;
}

.input-label {
  font-size: 12px;
}

.input-doc-link {
  font-size: 12px;
  font-weight: normal;
  text-align: right;
  text-decoration: none;
}

.logo-img {
  box-sizing: border-box;
  width: 38px;
  padding: 4px;
}

.logo {
  margin-bottom: 5px;
}

.logo--active {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 3px;
  border: 2px solid #13a3fd;
  border-radius: 50%;
}

.logo-img--inactive {
  filter: grayscale(1);
}

.auth-label {
  font-size: 12px;
  color: #8d8d8dde;
}

.social-auth-input__container {
  display: flex;
  flex-direction: row;
}

.social-auth-input__container > * + * {
  margin-left: 10px;
}

.social-auth-input-field__container {
  flex: 1;
}

.social-auth-input__wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.social-auth-input__wrapper > * + * {
  margin-top: 10px;
}

.social-auth-input {
  flex: 1;
}

.error-message {
  margin-top: 5px;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.5;
  color: #ee193f;
}

@media only screen and (max-width: 1023px) {
  .input-doc-link,
  .input-label {
    text-align: left;
  }
}

@media only screen and (max-width: 1080px) {
  .social-auth-input-field__container {
    flex-direction: column;
  }
}
</style>
