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
import { socialLogins, DOCS_URL } from '@/utils/constants'
import type { SocialAuthVerifier } from '@/utils/constants'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)
const selectedCredentialInput: Ref<SocialAuthVerifier> = ref('google')

const socialAuth = socialLogins.map((login) => {
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
  if (auth.hasClientSecret) {
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
</script>

<template>
  <section name="social-auth">
    <SettingCard>
      <template #title>Social Auth</template>
      <template #description>
        Provide easy onboarding for dApp users with familiar social
        authentication mechanisms. Arcana securely manages public-private key
        pair for each authenticated user using distributed key generation.
        <a :href="`${DOCS_URL}/docs/dkg`" target="_blank" class="learn-more">
          LEARN MORE
        </a>
      </template>
      <form @submit.prevent="handleSave">
        <div class="social-auth-creds__container">
          <div>
            <VStack
              v-for="auth in socialAuthRef"
              :key="`social-login-${auth.verifier}`"
              direction="column"
              align="start"
            >
              <button
                :for="auth.verifier"
                class="sub-heading-5 verifier-name"
                @click.prevent="() => (selectedCredentialInput = auth.verifier)"
              >
                <img
                  :src="auth.icon"
                  class="logo-img"
                  :class="{
                    'logo-img--active':
                      selectedCredentialInput === auth.verifier,
                  }"
                />
                <p class="auth-label">{{ auth.name }}</p>
              </button>
            </VStack>
          </div>
          <span class="seperator"></span>
          <div class="social-auth__input">
            <div v-for="auth in socialAuthRef" :key="auth.verifier">
              <div class="social-auth-input__container">
                <VStack
                  v-if="selectedCredentialInput === auth.verifier"
                  gap="1rem"
                  class="social-auth-input-field__container"
                >
                  <VStack class="social-auth-input__wrapper">
                    <VStack
                      justify="space-between"
                      align="center"
                      sm-direction="column"
                      md-direction="column"
                      sm-align="start"
                      md-align="start"
                    >
                      <p class="input-label">Client ID</p>
                      <a
                        class="input-doc-link"
                        :href="auth.documentation"
                        target="_blank"
                        >How to get your Client ID?</a
                      >
                    </VStack>
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
                    <VStack
                      justify="space-between"
                      align="center"
                      sm-direction="column"
                      md-direction="column"
                      sm-align="start"
                      md-align="start"
                    >
                      <p class="input-label">
                        {{
                          isAWSSelected()
                            ? 'Cognito User Pool URL'
                            : 'Client Secret'
                        }}
                      </p>
                      <a
                        class="input-doc-link"
                        :href="auth.documentation"
                        target="_blank"
                      >
                        How to get your
                        {{
                          auth.verifier === 'aws' ? 'URL?' : 'Client Secret?'
                        }}
                      </a>
                    </VStack>
                    <VTextField
                      v-model.trim="auth.clientSecret"
                      no-message
                      class="social-auth-input"
                      :placeholder="
                        isAWSSelected()
                          ? 'Cognito User Pool URL'
                          : 'Client Secret'
                      "
                      @keyup.delete="handleInputDelete(auth, 'clientSecret')"
                    ></VTextField>
                  </VStack>
                </VStack>
              </div>
              <VStack gap="1.5rem">
                <span v-show="!isAuthValid(auth)" class="body-1 error-message">
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

.verifier-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  background-color: transparent;
  border: none;
  outline: none;
}

.input-label {
  font-family: var(--font-body);
  font-size: 12px;
}

.input-doc-link {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: normal;
  text-align: right;
  text-decoration: none;
}

.logo-img {
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  padding: 5px;
  object-fit: contain;
}

.logo-img--active {
  border: 2px solid #13a3fd;
  border-radius: 50%;
}

.auth-label {
  font-size: 12px;
  color: #8d8d8dde;
}

.social-auth-creds__container {
  display: flex;
}

.social-auth-creds__container > * + * {
  margin-left: 30px;
}

.social-auth__input {
  width: 100%;
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
  flex-grow: 1;
}

.error-message {
  margin-top: 5px;
  font-family: var(--font-body);
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
