<template>
  <section style="margin-top: 3em" v-if="isConfigured">
    <v-stack direction="column" gap="1em" align="start">
      <h2>APP NAME</h2>
      <v-text-field v-model="appName" strong class="app-name" />
    </v-stack>
  </section>
  <v-card class="app-name-card" v-else :id="'configure-step-' + 1">
    <v-stack
      direction="row"
      sm-direction="column"
      gap="1.2em"
      sm-gap="1.2em"
      justify="center"
    >
      <h4 style="margin-top: 1em">ENTER APP NAME</h4>
      <v-text-field
        v-model="appName"
        strong
        style="width: 30vw; min-width: 300px"
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
import { useStore } from "vuex";

export default {
  name: "ConfigureAppName",
  components: { VTextField, VCard, VButton, VStack },
  props: {
    isConfigured: Boolean,
  },
  setup(props) {
    const store = useStore();
    const appName = ref(store.getters.appName);
    watch(
      () => appName.value,
      () => {
        store.dispatch("updateAppName", appName.value);
        if (props.isConfigured && !store.getters.onConfigChange) {
          store.dispatch("configChangeDetected");
        }
      }
    );
    return {
      appName,
    };
  },
};
</script>