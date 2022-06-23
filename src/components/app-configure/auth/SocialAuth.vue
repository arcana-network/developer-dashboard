<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import CopyIcon from '@/assets/iconography/copy.svg'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import type {
  SocialAuthState,
  SocialAuthVerifier,
  SocialAuthField,
} from '@/store/app.store'
import { socialLogins } from '@/utils/constants'
import copyToClipboard from '@/utils/copyToClipboard'

const store = useStore()

const socialAuthFields: SocialAuthField[] = [
  'clientId',
  'clientSecret',
  'redirectUri',
]

const socialAuth: ComputedRef<SocialAuthState[]> = computed(
  () => store.getters.socialAuth
)

function getSocialAuth(
  verifier: SocialAuthVerifier
): SocialAuthState | undefined {
  return socialAuth.value.find((auth) => auth.verifier === verifier)
}

function handleCloseClick(verifier: SocialAuthVerifier) {
  store.commit('removeSocialAuth', verifier)
}

function handleFieldUpdate(
  verifier: SocialAuthVerifier,
  field: SocialAuthField,
  value: string
) {
  const existingAuth = getSocialAuth(verifier)
  if (existingAuth) {
    const areOtherFieldsEmpty: boolean = socialAuthFields
      .filter((el) => el !== field)
      .every((authField) => !existingAuth[authField])
    if (!value && areOtherFieldsEmpty) {
      store.commit('removeSocialAuth', verifier)
    } else {
      store.commit('updateSocialAuth', { verifier, field, value })
    }
  } else {
    store.commit('addSocialAuth', { verifier, field, value })
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
        <a
          href="https://docs.beta.arcana.network/docs/dkg"
          target="_blank"
          class="learn-more"
        >
          Learn More...
        </a>
      </template>
      <VStack gap="2rem">
        <h4 class="verifier-name">Social</h4>
        <VSeperator vertical />
        <h4>Keys</h4>
      </VStack>
      <VSeperator class="social-auth-content-separator" />
      <VStack
        v-for="socialLogin in socialLogins"
        :key="`social-login-${socialLogin.name}`"
        align="center"
        gap="2rem"
      >
        <span class="sub-heading-5 verifier-name">{{ socialLogin.name }}</span>
        <VSeperator vertical class="social-auth-separator" />
        <VStack gap="1.25rem" class="social-auth-input-container">
          <VTextField
            :model-value="getSocialAuth(socialLogin.verifier)?.clientId"
            no-message
            class="social-auth-input"
            placeholder="Client ID"
            :icon="CopyIcon"
            clickable-icon
            @icon-clicked="
              copyToClipboard(
                getSocialAuth(socialLogin.verifier)?.clientId || ''
              )
            "
            @update:model-value="
              handleFieldUpdate(socialLogin.verifier, 'clientId', $event)
            "
          ></VTextField>
          <VTextField
            v-if="socialLogin.hasClientSecret"
            :model-value="getSocialAuth(socialLogin.verifier)?.clientSecret"
            no-message
            class="social-auth-input"
            placeholder="Client Secret"
            @update:model-value="
              handleFieldUpdate(socialLogin.verifier, 'clientSecret', $event)
            "
          ></VTextField>
          <VTextField
            v-if="socialLogin.hasRedirectUri"
            :model-value="getSocialAuth(socialLogin.verifier)?.redirectUri"
            no-message
            class="social-auth-input"
            placeholder="Redirect URI"
            @update:model-value="
              handleFieldUpdate(socialLogin.verifier, 'redirectUri', $event)
            "
          ></VTextField>
        </VStack>
        <VStack gap="1rem" align="center">
          <VTooltip title="Get Credentials">
            <a
              :href="socialLogin.documentation"
              target="_blank"
              class="icon-link"
            >
              <img src="@/assets/iconography/link.svg" alt="Get Credentials" />
            </a>
          </VTooltip>
          <VTooltip title="Clear Fields">
            <img
              src="@/assets/iconography/close.svg"
              alt="Clear Fields"
              class="cursor-pointer"
              @click.stop="handleCloseClick(socialLogin.verifier)"
            />
          </VTooltip>
        </VStack>
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
.verifier-name {
  flex: 0 0 6rem;
}

.social-auth-separator {
  height: calc(100% + 2rem);
  margin-top: -2rem;
}

.social-auth-content-separator {
  width: calc(100% - 6rem) !important;
  margin: 0 auto 0 0;
}

.social-auth-input-container {
  width: calc(100% - 16rem);
}

.social-auth-input {
  flex-grow: 1;
}
</style>
