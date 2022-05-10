<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import CopyIcon from '@/assets/iconography/copy.svg'
import LinkIcon from '@/assets/iconography/link.svg'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import {
  socialLogins,
  type SocialAuth,
  type SocialAuthVerifier,
  type SocialAuthField,
} from '@/utils/constants'
import copyToClipboard from '@/utils/copyToClipboard'

const store = useStore()

const socialAuthTypes: SocialAuthField[] = [
  'clientId',
  'clientSecret',
  'redirectUri',
]

const authDetails: ComputedRef<SocialAuth[]> = computed(
  () => store.getters.socialAuth
)

function getAuthIndex(
  authDetailsList: SocialAuth[],
  verifier: SocialAuthVerifier
): number {
  return authDetailsList.findIndex(
    (authDetail: SocialAuth) => authDetail.verifier === verifier
  )
}

function getClient(verifier: SocialAuthVerifier): SocialAuth | undefined {
  const tempAuthDetails: SocialAuth[] = [...authDetails.value]
  let existingAuthIndex = getAuthIndex(tempAuthDetails, verifier)
  if (existingAuthIndex !== -1) {
    return tempAuthDetails[existingAuthIndex]
  }
}

function handleUpdate(
  verifier: SocialAuthVerifier,
  inputType: SocialAuthField,
  value: string
) {
  let tempAuthDetails: SocialAuth[] = [...authDetails.value]
  const existingAuthIndex = getAuthIndex(tempAuthDetails, verifier)
  if (existingAuthIndex !== -1) {
    const existingAuth = { ...tempAuthDetails[existingAuthIndex] }
    const otherInputTypes: SocialAuthField[] = socialAuthTypes.filter(
      (el) => el !== inputType
    )
    if (
      !value &&
      !existingAuth[otherInputTypes[0]] &&
      !existingAuth[otherInputTypes[1]]
    ) {
      tempAuthDetails = tempAuthDetails.filter(
        (authDetail) => authDetail.verifier !== existingAuth.verifier
      )
    } else {
      existingAuth[inputType] = value
      tempAuthDetails[existingAuthIndex] = existingAuth
    }
  } else {
    tempAuthDetails.push({
      verifier,
      [inputType]: value,
    })
  }
  store.commit('updateSocialAuth', tempAuthDetails)
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
            :model-value="getClient(socialLogin.verifier)?.clientId"
            no-message
            class="social-auth-input"
            placeholder="Client ID"
            :icon="CopyIcon"
            clickable-icon
            @icon-clicked="
              copyToClipboard(getClient(socialLogin.verifier)?.clientId || '')
            "
            @update:model-value="
              handleUpdate(socialLogin.verifier, 'clientId', $event)
            "
          ></VTextField>
          <VTextField
            v-if="socialLogin.hasClientSecret"
            :model-value="getClient(socialLogin.verifier)?.clientSecret"
            no-message
            class="social-auth-input"
            placeholder="Client Secret"
            @update:model-value="
              handleUpdate(socialLogin.verifier, 'clientSecret', $event)
            "
          ></VTextField>
          <VTextField
            v-if="socialLogin.hasRedirectUri"
            :model-value="getClient(socialLogin.verifier)?.redirectUri"
            no-message
            class="social-auth-input"
            placeholder="Redirect URI"
            @update:model-value="
              handleUpdate(socialLogin.verifier, 'redirectUri', $event)
            "
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
