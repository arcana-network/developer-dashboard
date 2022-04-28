<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VRadioGroup from '@/components/lib/VRadioGroup/VRadioGroup.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const props = defineProps({
  isConfigured: Boolean,
})

const store = useStore()

const env = computed(() => {
  return store.getters.env
})

let selectedChain = computed(() => {
  return store.getters[env.value + '/chainType']
})

function onLearnMoreClicked() {
  store.dispatch('showLearnMorePopup', {
    header: 'CHAIN TYPE',
    description:
      'Where are you currently building your DApp? This is optional for now but will give us good insights into which bridges/integrations we should prioritise here at Arcana.',
  })
}

function changeChainType(selectedChain: string) {
  store.dispatch(env.value + '/updateChainType', selectedChain)
  if (props.isConfigured && !store.getters.onConfigChange) {
    store.dispatch('configChangeDetected')
  }
}
</script>

<template>
  <v-card :id="'configure-step-' + 3" class="chain-type-card">
    <v-stack direction="column" gap="1.2em" class="flex-grow">
      <h4 class="width-100">CHOOSE CHAIN TYPE</h4>
      <v-stack
        direction="row"
        sm-direction="column"
        sm-gap="4vw"
        :wrap="true"
        gap="4vw"
      >
        <v-stack
          direction="column"
          align="start"
          gap="1.2em"
          class="app-section-description"
        >
          <span class="body-1">
            If your application is being built for one or more of these
            blockchains, please specify the same by turning on the relevant
            chains.
          </span>
          <v-button
            variant="link"
            label="LEARN MORE"
            :action="onLearnMoreClicked"
          />
        </v-stack>
        <v-stack direction="column" gap="2em" class="flex-grow">
          <v-card variant="depressed" class="chain-options-container">
            <v-stack
              direction="column"
              gap="1.2em"
              justify="space-between"
              class="flex-grow"
            >
              <v-radio-group
                v-model="selectedChain"
                :options="chains"
                name="ChainSelection"
                @update:modelValue="changeChainType"
              />
            </v-stack>
          </v-card>
        </v-stack>
      </v-stack>
    </v-stack>
  </v-card>
</template>

<style scoped>
.chain-type-card {
  padding: 1.5em 2em;
  margin-top: 2em;
}

h4 {
  display: block;
}

.chain-options-container {
  width: calc(50% - 6em);
  min-width: 200px;
  padding: 1.2em;
}
</style>
