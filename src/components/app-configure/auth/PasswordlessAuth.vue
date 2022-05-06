<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'

const store = useStore()
const javascriptOrigin: ComputedRef<string> = computed(
  () => store.getters.passwordlessAuth.javascriptOrigin
)
const redirectUri: ComputedRef<string> = computed(
  () => store.getters.passwordlessAuth.redirectUri
)

function handleJavascriptOriginUpdate(value: string) {
  store.commit('updatePasswordlessAuthJavascriptOrigin', value)
}

function handleRedirectUriUpdate(value: string) {
  store.commit('updatePasswordlessAuthRedirectUri', value)
}
</script>

<template>
  <section name="passwordless-auth">
    <SettingCard>
      <template #title>Passwordless Auth</template>
      <template #description
        >Provide your users the convenience of using magic links delivered to
        their email addresses that they can click on to authenticate themselves
        instead of using passwords. <a>LEARN MORE</a></template
      >
      <VStack
        direction="row"
        align="center"
        sm-direction="column"
        sm-align="start"
        gap="1rem"
      >
        <label for="passwordless-javascript-origin">JavaScript Origin</label>
        <VTextField
          id="passwordless-javascript-origin"
          :model-value="javascriptOrigin"
          class="passwordless-input"
          no-message
          @update:model-value="handleJavascriptOriginUpdate"
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
          :model-value="redirectUri"
          class="passwordless-input"
          no-message
          @update:model-value="handleRedirectUriUpdate"
        />
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
label {
  width: 10rem;
}

.passwordless-input {
  width: 100%;
  max-width: 40rem;
}
</style>
