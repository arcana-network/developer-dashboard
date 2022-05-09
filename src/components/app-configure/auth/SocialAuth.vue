<script lang="ts" setup>
import { useStore } from 'vuex'

import CopyIcon from '@/assets/iconography/copy.svg'
import LinkIcon from '@/assets/iconography/link.svg'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import {
  socialLogins,
  type SocialLogin,
  type SocialAuth,
} from '@/utils/constants'
import copyToClipboard from '@/utils/copyToClipboard'

const store = useStore()

let authDetails = [...store.getters.socialAuth]

function handleUpdate(
  socialLogin: SocialLogin,
  inputType: 'clientId' | 'clientSecret' | 'redirectUri'
) {
  if (
    !socialLogin.clientId &&
    !socialLogin.clientSecret &&
    !socialLogin.redirectUri
  ) {
    authDetails = authDetails.filter(
      (authDetail) => authDetail.verifier !== socialLogin.verifier
    )
  } else {
    const existingAuthIndex = authDetails.findIndex(
      (authDetail: SocialAuth) => authDetail.verifier === socialLogin.verifier
    )
    if (existingAuthIndex !== -1) {
      authDetails[existingAuthIndex][inputType] = socialLogin[inputType]
    } else {
      authDetails.push({
        verifier: socialLogin.verifier,
        [inputType]: socialLogin[inputType],
      })
    }
  }

  store.commit('updateSocialAuth', authDetails)
}
</script>

<template>
  <section name="social-auth">
    <SettingCard>
      <template #title>Social Auth</template>
      <template #description>
        Increase adoption of your app by enabling this option. Arcana will take
        care of issuing public and prviate keys to each user through our
        Decentralised Key Generation (DKG) mechanism and keep them secure.
        <a>LEARN MORE</a>
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
            v-model="socialLogin.clientId"
            no-message
            class="social-auth-input"
            placeholder="Client ID"
            :icon="CopyIcon"
            clickable-icon
            @icon-clicked="
              copyToClipboard(socialLogin.clientId ? socialLogin.clientId : '')
            "
            @update:model-value="handleUpdate(socialLogin, 'clientId')"
          ></VTextField>
          <VTextField
            v-if="socialLogin.hasClientSecret"
            v-model="socialLogin.clientSecret"
            no-message
            class="social-auth-input"
            placeholder="Client Secret"
            @update:model-value="handleUpdate(socialLogin, 'clientSecret')"
          ></VTextField>
          <VTextField
            v-if="socialLogin.hasRedirectUri"
            v-model="socialLogin.redirectUri"
            no-message
            class="social-auth-input"
            placeholder="Redirect URI"
            @update:model-value="handleUpdate(socialLogin, 'redirectUri')"
          ></VTextField>
        </VStack>
        <a :href="socialLogin.documentation" target="_blank">
          <img :src="LinkIcon" alt="Go to docs" />
        </a>
      </VStack>
    </SettingCard>
  </section>
</template>

<style>
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
