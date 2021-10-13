<template>
  <section style="margin-top: 3em" v-if="isConfigured">
    <v-stack direction="column" gap="1em" align="start">
      <h2>APP NAME</h2>
      <v-text-field v-model="appName" strong class="app-name" />
    </v-stack>
  </section>
  <v-card class="app-name-card" v-else :id="'configure-step-' + 1">
    <v-stack direction="column" gap="1.2em">
      <h4>ENTER APP NAME</h4>
      <v-stack :wrap="true" direction="row" gap="4vw" justify="space-between">
        <v-stack
          direction="column"
          align="start"
          gap="1.2em"
          class="app-section-description"
        >
          <span class="body-1">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
          </span>
          <v-button variant="link" label="LEARN MORE" />
        </v-stack>
        <v-text-field v-model="appName" strong class="app-name-init" />
      </v-stack>
    </v-stack>
  </v-card>
</template>

<style scoped>
.app-name {
  width: 20vw;
  min-width: 200px;
  max-width: 400px;
}
.app-name-init {
  width: 10vw;
  min-width: 200px;
}
.app-name-card {
  margin-top: 2em;
  padding: 1.5em 2em;
}
h4 {
  width: 100%;
  display: block;
}
</style>

<script>
import { ref, watch } from "@vue/runtime-core";
import VTextField from "../lib/VTextField/VTextField.vue";
import VCard from "../lib/VCard/VCard.vue";
import VButton from "../lib/VButton/VButton.vue";
import VStack from "../lib/VStack/VStack.vue";
export default {
  name: "ConfigureAppName",
  components: { VTextField, VCard, VButton, VStack },
  props: {
    isConfigured: Boolean,
    store: Object,
  },
  setup(props) {
    const store = props.store;
    const appName = ref("");
    appName.value = store.getters.appName;
    watch(
      () => appName.value,
      () => {
        store.dispatch("updateAppName", { appName: appName.value });
        if (props.isConfigured && !store.getters.onChange) {
          store.dispatch("changeDetected");
        }
      }
    );
    return {
      appName,
    };
  },
};
</script>