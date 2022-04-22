<template>
  <v-card class="region-container" :id="'configure-step-' + 2">
    <v-stack direction="column" gap="1.2em" class="flex-grow">
      <h4>CHOOSE REGION</h4>
      <v-stack direction="row" :wrap="true" gap="4vw" smDirection="column" smGap="4vw">
        <v-stack direction="column" gap="1.2em" align="start" class="app-section-description">
          <span class="body-1">
            All assets stored by your application will be distributed across
            several storage nodes located at various physical locations across
            the world. Turn on specific regions only if your application needs
            these assets to be stored in storage nodes within a region.
          </span>
          <v-button variant="link" label="LEARN MORE" :action="onLearnMoreClicked" />
        </v-stack>
        <v-stack direction="column" gap="2em" class="flex-grow">
          <v-card variant="depressed" class="flex justify-space-between region-anywhere-container">
            <span class="body-1">Anywhere</span>
            <v-switch v-model="region.any" disabled />
          </v-card>
          <v-card variant="depressed" class="flex sm-column justify-space-between" style="padding: 1.2em">
            <v-stack direction="column" :wrap="true" gap="1em" class="flex-grow">
              <div class="flex justify-space-between width-100">
                <span class="body-1">Asia</span>
                <v-tooltip title="Coming Soon">
                  <v-switch v-model="region.asia" disabled />
                </v-tooltip>
              </div>
              <div class="flex justify-space-between width-100">
                <span class="body-1">Africa</span>
                <v-tooltip title="Coming Soon">
                  <v-switch v-model="region.africa" disabled />
                </v-tooltip>
              </div>
              <div class="flex justify-space-between width-100">
                <span class="body-1">Australia</span>
                <v-tooltip title="Coming Soon">
                  <v-switch v-model="region.australia" disabled />
                </v-tooltip>
              </div>
            </v-stack>
            <v-seperator :vertical="true" style="margin: 0 2em" class="mobile-remove" />
            <v-stack direction="column" gap="1em" class="sm-column-gap flex-grow">
              <div class="flex justify-space-between width-100">
                <span class="body-1">Europe</span>
                <v-tooltip title="Coming Soon">
                  <v-switch v-model="region.europe" disabled />
                </v-tooltip>
              </div>
              <div class="flex justify-space-between width-100">
                <span class="body-1">North America</span>
                <v-tooltip title="Coming Soon">
                  <v-switch v-model="region.northAmerica" disabled />
                </v-tooltip>
              </div>
              <div class="flex justify-space-between width-100">
                <span class="body-1">South America</span>
                <v-tooltip title="Coming Soon">
                  <v-switch v-model="region.southAmerica" disabled />
                </v-tooltip>
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

<script lang="ts">
import { watch, ref, computed } from "vue";
import { useStore } from "vuex";
import VButton from "@/components/lib/VButton/VButton.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VSeperator from "@/components/lib/VSeperator/VSeperator.vue";
import VStack from "@/components/lib/VStack/VStack.vue";
import VSwitch from "@/components/lib/VSwitch/VSwitch.vue";
import VTooltip from "@/components/lib/VTooltip/VTooltip.vue";

export default {
  name: "ConfigureAppRegion",
  props: {
    isConfigured: Boolean,
  },
  components: { VCard, VButton, VSwitch, VSeperator, VStack, VTooltip },
  setup(props) {
    const store = useStore();

    const env = computed(() => {
      return store.getters.env;
    });

    let region = ref({ ...store.getters[env.value + "/region"] });

    function onLearnMoreClicked() {
      store.dispatch("showLearnMorePopup", {
        header: "STORAGE REGION",
        description: `Arcana's storage network is designed to afford for your user's data to be distributed and stored within a specific region to aid in both faster uploads/downloads as well conforming with any data regulatory requirements such as GDPR. if your app has no such requirements, you can simply choose to store "Anywhere" and data will automatically get distributed and stored on immediately available nodes.`,
      });
    }

    watch(
      () => region.value,
      () => {
        const previousRegionCopy = { ...store.getters[env.value + "/region"] };
        Object.keys(region.value).forEach((key) => {
          if (key !== "any") {
            if (region.value.any && !previousRegionCopy.any) {
              region.value[key] = false;
            } else if (
              region.value[key] &&
              !previousRegionCopy[key] &&
              region.value.any
            ) {
              region.value.any = false;
            }
          }
        });
        store.dispatch(env.value + "/updateRegion", region.value);
        if (props.isConfigured && !store.getters.onConfigChange) {
          store.dispatch("configChangeDetected");
        }
      },
      { deep: true }
    );

    return {
      region,
      onLearnMoreClicked,
    };
  },
};
</script>
