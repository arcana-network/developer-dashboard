<template>
  <v-card class="chain-type-card" :id="'configure-step-' + 3">
    <v-stack direction="column" gap="1.2em" class="flex-grow">
      <h4 class="width-100">CHOOSE CHAIN TYPE</h4>
      <v-stack
        direction="row"
        smDirection="column"
        smGap="4vw"
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
              <v-stack
                direction="row"
                justify="space-between"
                class="width-100"
              >
                <span class="body-1"> Ethereum </span>
                <v-switch
                  :value="chainType === 'ethereum'"
                  @checked="changeChainType($event, 'ethereum')"
                />
              </v-stack>
              <v-stack
                direction="row"
                justify="space-between"
                class="width-100"
              >
                <span class="body-1"> Polygon </span>
                <v-switch
                  :value="chainType === 'polygon'"
                  @checked="changeChainType($event, 'polygon')"
                />
              </v-stack>
              <v-stack
                direction="row"
                justify="space-between"
                class="width-100"
              >
                <span class="body-1"> Binance </span>
                <v-switch
                  :value="chainType === 'binance'"
                  @checked="changeChainType($event, 'binance')"
                />
              </v-stack>
            </v-stack>
          </v-card>
        </v-stack>
      </v-stack>
    </v-stack>
  </v-card>
</template>

<style scoped>
.chain-type-card {
  margin-top: 2em;
  padding: 1.5em 2em;
}
h4 {
  display: block;
}
.chain-options-container {
  padding: 1.2em;
  width: calc(50% - 6em);
  min-width: 200px;
}
</style>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

import VButton from "../lib/VButton/VButton.vue";
import VCard from "../lib/VCard/VCard.vue";
import VStack from "../lib/VStack/VStack.vue";
import VSwitch from "../lib/VSwitch/VSwitch.vue";

export default {
  name: "ConfigureAppChainType",
  props: {
    isConfigured: Boolean,
    store: Object,
  },
  components: { VCard, VButton, VSwitch, VStack },
  setup(props) {
    const store = useStore();

    const env = computed(() => {
      return store.getters.env;
    });

    let chainType = computed(() => {
      return store.getters[env.value + "/chainType"];
    });

    function onLearnMoreClicked() {
      store.dispatch("showLearnMorePopup", {
        header: "CHAIN TYPE",
        description:
          "Where are you currently building your DApp? This is optional for now but will give us good insights into which bridges/integrations we should prioritise here at Arcana.",
      });
    }

    function changeChainType(ev, selectedChainType) {
      if (ev.value) {
        store.dispatch(env.value + "/updateChainType", selectedChainType);
        if (props.isConfigured && !store.getters.onConfigChange) {
          store.dispatch("configChangeDetected");
        }
      }
    }

    return {
      chainType,
      changeChainType,
      onLearnMoreClicked,
    };
  },
};
</script>