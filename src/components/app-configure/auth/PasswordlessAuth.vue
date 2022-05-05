<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'

const store = useStore()
const javascriptOrigin: Ref<string> = ref(
  store.getters.passwordlessAuth.javascriptOrigin
)
const redirectUri: Ref<string> = ref(store.getters.passwordlessAuth.redirectUri)
watch(
  () => javascriptOrigin.value,
  () => {
    store.commit(
      'updatePasswordlessAuthJavascriptOrigin',
      javascriptOrigin.value
    )
  }
)
watch(
  () => redirectUri.value,
  () => {
    store.commit('updatePasswordlessAuthRedirectUri', redirectUri.value)
  }
)
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
        <label for="passwordless-javascript-origin">Javascript Origin</label>
        <VTextField
          id="passwordless-javascript-origin"
          v-model="javascriptOrigin"
          no-message
          input-container-class="passwordless-input"
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
          v-model="redirectUri"
          no-message
          input-container-class="passwordless-input"
        />
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
label {
  width: 12rem;
}

.passwordless-input {
  width: 100%;
  max-width: 32rem;
}
</style>
