<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'

const props = defineProps({
  isConfigured: Boolean,
})

const emit = defineEmits(['enter-click'])

const store = useStore()
const appName = ref('')

const appNameError = computed(() => {
  return store.getters.appNameError
})

appName.value = store.getters.appName

function onEnterClick() {
  emit('enter-click')
}

watch(
  () => appName.value,
  () => {
    store.dispatch('updateAppName', appName.value)
    if (!appName.value?.trim()) {
      store.dispatch('updateAppNameError', true)
    } else {
      store.dispatch('updateAppNameError', false)
    }
    if (props.isConfigured && !store.getters.onConfigChange) {
      store.dispatch('configChangeDetected')
    }
  }
)
</script>

<template>
  <section v-if="isConfigured" style="margin-top: 3em">
    <v-stack direction="column" gap="1em" align="start">
      <h2>APP NAME</h2>
      <v-text-field
        v-model="appName"
        strong
        class="app-name"
        :message-type="appNameError ? 'error' : ''"
        message="App name is required"
      />
    </v-stack>
  </section>
  <v-card v-else :id="'configure-step-' + 1" class="app-name-card">
    <v-stack
      direction="row"
      sm-direction="column"
      gap="1.2em"
      sm-gap="1.2em"
      style="flex-grow: 1"
    >
      <h4 style="width: 25vw; min-width: 280px; margin-top: 1.5em">
        ENTER APP NAME
      </h4>
      <v-text-field
        v-model="appName"
        strong
        style="width: 20vw; min-width: 300px; max-width: 400px; margin-top: 1em"
        :message-type="appNameError ? 'error' : ''"
        message="App name is required"
        placeholder="Enter app name"
        @keyup.enter="onEnterClick"
      />
    </v-stack>
  </v-card>
</template>

<style scoped>
.app-name {
  width: 20vw;
  min-width: 300px;
  max-width: 400px;
}

.app-name-card {
  padding: 1.5em 2em;
  margin-top: 2em;
}

h4 {
  display: block;
  width: 100%;
}
</style>
