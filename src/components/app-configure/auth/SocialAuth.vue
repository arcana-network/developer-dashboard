<script lang="ts" setup>
import { reactive, watch } from 'vue'

import CopyIcon from '@/assets/iconography/copy.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import { socialLogins, DOCS_URL } from '@/utils/constants'
import copyToClipboard from '@/utils/copyToClipboard'

const appsStore = useAppsStore()
const appId = useAppId()
const app = appsStore.app(appId)

const socialAuth = socialLogins.map((login) => {
  const auth = app.auth.social.find((el) => el.verifier === login.verifier)
  if (auth) {
    return {
      ...login,
      ...auth,
    }
  }
  return { ...login }
})

const socialAuthRef = reactive(socialAuth)

function handleClear(verifier: string) {
  const authIndex = socialAuthRef.findIndex(
    (auth) => auth.verifier === verifier
  )
  if (authIndex > -1) {
    delete socialAuthRef[authIndex].clientId
    delete socialAuthRef[authIndex].clientSecret
    delete socialAuthRef[authIndex].redirectUri
  }
}

watch(
  () => socialAuthRef,
  () => console.log(socialAuthRef)
)
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
      <VStack gap="2rem">
        <h4 class="verifier-name">Social</h4>
        <VSeperator vertical style="margin-bottom: -1rem" />
        <h4>Keys</h4>
      </VStack>
      <VSeperator class="social-auth-content-separator" />
      <form>
        <VStack direction="column" gap="2rem" class="flex-grow">
          <VStack
            v-for="auth in socialAuthRef"
            :key="`social-login-${auth.verifier}`"
            align="center"
            gap="2rem"
          >
            <label :for="auth.verifier" class="sub-heading-5 verifier-name">
              {{ auth.name }}
            </label>
            <VSeperator vertical class="social-auth-separator" />
            <VStack gap="1.25rem" class="social-auth-input-container">
              <VTextField
                :id="auth.verifier"
                v-model.trim="auth.clientId"
                no-message
                class="social-auth-input"
                placeholder="Client ID"
                :icon="CopyIcon"
                clickable-icon
                @icon-clicked="copyToClipboard(auth.clientId || '')"
              ></VTextField>
              <VTextField
                v-if="auth.hasClientSecret"
                v-model.trim="auth.clientSecret"
                no-message
                class="social-auth-input"
                placeholder="Client Secret"
              ></VTextField>
              <VTextField
                v-if="auth.hasRedirectUri"
                v-model.trim="auth.redirectUri"
                no-message
                class="social-auth-input"
                placeholder="Redirect URI"
              ></VTextField>
            </VStack>
            <VStack gap="1rem" align="center">
              <VTooltip title="Get Credentials">
                <a :href="auth.documentation" target="_blank" class="icon-link">
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
          <ConfigureActionButtons />
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
  height: 6rem;
  margin-top: -2rem;
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
</style>
