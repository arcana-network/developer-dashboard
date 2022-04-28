<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useStore } from 'vuex'

import VButton from '@/components/lib/VButton.vue'
import VCard from '@/components/lib/VCard.vue'
import VSeparator from '@/components/lib/VSeperator.vue'
import VStack from '@/components/lib/VStack.vue'
import VTextField from '@/components/lib/VTextField.vue'

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
    <VCard>
      <VStack direction="column">
        <h3 class="uppercase">Passwordless Auth</h3>
        <VSeparator />
        <div>
          Provide your users the convenience of using magic links delivered to
          their email addresses that they can click on to authenticate
          themselves instead of using passwords.
          <VButton variant="link" label="LEARN MORE" />
        </div>
        <VStack direction="row">
          <label for="passwordless-javascript-origin">Javascript Origin</label>
          <VTextField
            id="passwordless-javascript-origin"
            v-model="javascriptOrigin"
          />
        </VStack>
        <VStack direction="row">
          <label for="passwordless-redirect-uri">Redirect URI</label>
          <VTextField id="passwordless-redirect-uri" v-model="redirectUri" />
        </VStack>
      </VStack>
    </VCard>
  </section>
</template>
