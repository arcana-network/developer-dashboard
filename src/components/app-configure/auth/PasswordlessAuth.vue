<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useStore } from 'vuex'

import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
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
    <VCard variant="elevated" class="passwordless-auth-card">
      <VStack direction="column" gap="1.875rem">
        <h3 class="uppercase">Passwordless Auth</h3>
        <VSeperator class="separator" />
        <div class="body-1">
          Provide your users the convenience of using magic links delivered to
          their email addresses that they can click on to authenticate
          themselves instead of using passwords.
          <a class="link uppercase">Learn More</a>
        </div>
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
      </VStack>
    </VCard>
  </section>
</template>

<style scoped>
.passwordless-auth-card {
  padding: 1.875rem 1.5rem;
}

.separator {
  width: calc(100% + 1.5rem + 1.5rem);
  margin: auto -1.5rem;
}

label {
  width: 12rem;
}

.passwordless-input {
  width: 100%;
  max-width: 32rem;
}
</style>
