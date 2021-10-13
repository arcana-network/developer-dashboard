<template>
  <v-card class="region-container" :id="'configure-step-' + 2">
    <v-stack direction="column" gap="1.2em" class="flex-grow">
      <h4>CHOOSE REGION</h4>
      <v-stack
        direction="row"
        :wrap="true"
        gap="4vw"
        smDirection="column"
        smGap="4vw"
      >
        <v-stack
          direction="column"
          gap="1.2em"
          align="start"
          class="app-section-description"
        >
          <span class="body-1">
            All assets stored by your application will be distributed across
            several storage nodes located at various physical locations across
            the world. Turn on specific regions only if your application needs
            these assets to be stored in storage nodes within a region.
          </span>
          <v-button variant="link" label="LEARN MORE" />
        </v-stack>
        <v-stack direction="column" gap="2em" class="flex-grow">
          <v-card
            variant="depressed"
            class="flex justify-space-between region-anywhere-container"
          >
            <span class="body-1">Anywhere</span>
            <v-switch v-model="region.any" />
          </v-card>
          <v-card
            variant="depressed"
            class="flex sm-column justify-space-between"
            style="padding: 1.2em"
          >
            <v-stack
              direction="column"
              :wrap="true"
              gap="1em"
              class="flex-grow"
            >
              <div class="flex justify-space-between width-100">
                <span class="body-1">Asia</span>
                <v-switch v-model="region.asia" />
              </div>
              <div class="flex justify-space-between width-100">
                <span class="body-1">Africa</span>
                <v-switch v-model="region.africa" />
              </div>
              <div class="flex justify-space-between width-100">
                <span class="body-1">Australia</span>
                <v-switch v-model="region.australia" />
              </div>
            </v-stack>
            <v-seperator
              :vertical="true"
              style="margin: 0 2em"
              class="mobile-remove"
            />
            <v-stack
              direction="column"
              gap="1em"
              class="sm-column-gap flex-grow"
            >
              <div class="flex justify-space-between width-100">
                <span class="body-1">Europe</span>
                <v-switch v-model="region.europe" />
              </div>
              <div class="flex justify-space-between width-100">
                <span class="body-1">North America</span>
                <v-switch v-model="region.northAmerica" />
              </div>
              <div class="flex justify-space-between width-100">
                <span class="body-1">South America</span>
                <v-switch v-model="region.southAmerica" />
              </div>
            </v-stack>
          </v-card>
        </v-stack>
      </v-stack>
    </v-stack>
  </v-card>
</template>

<style scoped>
.region-container {
  margin-top: 1.2em;
  padding: 1.5em 2em;
}
h4 {
  width: 100%;
  display: block;
}
.region-anywhere-container {
  padding: 1.2em;
  width: calc(50% - 5em);
  min-width: 200px;
}
</style>

<script>
import VCard from "../lib/VCard/VCard.vue";
import VButton from "../lib/VButton/VButton.vue";
import VSwitch from "../lib/VSwitch/VSwitch.vue";
import VSeperator from "../lib/VSeperator/VSeperator.vue";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import VStack from "../lib/VStack/VStack.vue";
export default {
  name: "ConfigureAppRegion",
  props: {
    isConfigured: Boolean,
    store: Object,
  },
  components: { VCard, VButton, VSwitch, VSeperator, VStack },
  setup() {
    let __regionCopy = {
      any: false,
      asia: false,
      africa: false,
      austrialia: false,
      europe: false,
      northAmerica: false,
      southAmerica: false,
    };
    let region = ref({ ...__regionCopy });

    watch(
      () => region.value,
      () => {
        Object.keys(region.value).forEach((key) => {
          if (key !== "any") {
            if (region.value.any && !__regionCopy.any) {
              region.value[key] = false;
            } else if (
              region.value[key] &&
              !__regionCopy[key] &&
              region.value.any
            ) {
              region.value.any = false;
            }
          }
        });
        __regionCopy = { ...region.value };
        const env = store.getters.env;
        store.dispatch[env + "/"];
      },
      { deep: true }
    );

    return {
      region,
    };
  },
};
</script>