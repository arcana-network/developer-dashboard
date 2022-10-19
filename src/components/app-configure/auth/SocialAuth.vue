<script lang="ts" setup>
import { reactive } from 'vue'

import CopyIcon from '@/assets/iconography/copy.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import { deleteCred, updateApp } from '@/services/gateway.service'
import { setAppConfig } from '@/services/smart-contract.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import { socialLogins, DOCS_URL } from '@/utils/constants'
import copyToClipboard from '@/utils/copyToClipboard'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)

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

function handleClear(verifier: string) {
  const authIndex = socialAuthRef.findIndex(
    (auth) => auth.verifier === verifier
  )
  if (authIndex > -1) {
    delete socialAuthRef[authIndex].clientId
    delete socialAuthRef[authIndex].clientSecret
  }
}

function isAuthValid(auth: typeof socialAuth[0]) {
  if (auth.hasClientSecret) {
    if (!auth.clientId?.length && auth.clientSecret?.length) {
      auth.error = 'Client Id is required'
      return false
    }
    if (!auth.clientSecret?.length && auth.clientId?.length) {
      auth.error = 'Client secret is required'
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
    await updateApp(appId, { auth })
    await deleteCred(appId, authToRemove)
    toast.success('Saved social auth credentials')
    loaderStore.showLoader('Saving app config in smart contract...')
    await setAppConfig(app.name, socialAuthRef)
    toast.success('App config saved in blockchain')
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
</script>

<template>
  <section name="social-auth">
    <SettingCard>
      <template #title>Social Auth</template>
      <template #description>
        Provide easy onboarding for dApp users with familiar social
        authentication mechanisms. Arcana securely manages public-private key
        pair for each authenticated user using distributed key generation.
        <br />
        <a :href="`${DOCS_URL}/docs/dkg`" target="_blank" class="learn-more">
          Learn More...
        </a>
      </template>
      <VStack gap="1.5rem">
        <h4 class="verifier-name">Social</h4>
        <VSeperator vertical style="margin-bottom: -1rem" />
        <h4>Keys</h4>
      </VStack>
      <VSeperator class="social-auth-content-separator" />
      <form @submit.prevent="handleSave">
        <VStack direction="column" class="flex-grow">
          <VStack
            v-for="auth in socialAuthRef"
            :key="`social-login-${auth.verifier}`"
            direction="column"
          >
            <VStack align="center" gap="1.5rem">
              <label :for="auth.verifier" class="sub-heading-5 verifier-name">
                {{ auth.name }}
              </label>
              <VSeperator vertical class="social-auth-separator" />
              <VStack gap="1rem" class="social-auth-input-container">
                <VTextField
                  :id="auth.verifier"
                  v-model.trim="auth.clientId"
                  no-message
                  class="social-auth-input"
                  placeholder="Client ID"
                  :icon="CopyIcon"
                  clickable-icon
                  @icon-clicked="copyToClipboard(auth.clientId || '')"
                  @keyup.delete="handleInputDelete(auth, 'clientId')"
                ></VTextField>
                <VTextField
                  v-if="auth.hasClientSecret"
                  v-model.trim="auth.clientSecret"
                  no-message
                  class="social-auth-input"
                  placeholder="Client Secret"
                  @keyup.delete="handleInputDelete(auth, 'clientSecret')"
                ></VTextField>
              </VStack>
              <VStack gap="1rem" align="center">
                <VTooltip title="Get Credentials">
                  <a
                    :href="auth.documentation"
                    target="_blank"
                    class="icon-link"
                  >
                    <img
                      src="@/assets/iconography/link.svg"
                      alt="Get Credentials"
                    />
                  </a>
                </VTooltip>
                <VTooltip title="Clear Fields">
                  <img
                    src="@/assets/iconography/close.svg"
                    alt="Clear Fields"
                    class="cursor-pointer"
                    @click.stop="handleClear(auth.verifier)"
                  />
                </VTooltip>
              </VStack>
            </VStack>
            <VStack gap="1.5rem">
              <div class="verifier-name"></div>
              <VSeperator vertical class="social-auth-separator" />
              <span v-show="!isAuthValid(auth)" class="body-1 error-message">
                {{ auth.error }}
              </span>
            </VStack>
          </VStack>
          <ConfigureActionButtons
            :save-disabled="hasError() || hasSameValuesInStore()"
            :cancel-disabled="hasSameValuesInStore()"
            @cancel="handleCancel"
          />
        </VStack>
      </form>
    </SettingCard>
  </section>
</template>

<style scoped>
.verifier-name {
  flex: 0 0 6rem;
}

.social-auth-separator {
  height: 5rem;
  margin-top: -2.5rem;
}

.social-auth-content-separator {
  width: calc(100% - 6rem) !important;
  margin: -1rem auto 0 0;
}

.social-auth-input-container {
  width: calc(100% - 16rem);
}

.social-auth-input {
  flex-grow: 1;
}

.error-message {
  margin: 5px 20px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.5;
  color: #ee193f;
}
</style>
