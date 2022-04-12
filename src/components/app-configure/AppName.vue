<template>
  <section style="margin-top: 3em" v-if="isConfigured">
    <v-stack direction="column" gap="1em" align="start">
      <h2>APP NAME</h2>
      <v-text-field
        v-model="appName"
        strong
        class="app-name"
        :messageType="appNameError ? 'error' : ''"
        message="App name is required"
      />
    </v-stack>
  </section>
  <v-card class="app-name-card" v-else :id="'configure-step-' + 1">
    <v-stack
      direction="row"
      sm-direction="column"
      gap="1.2em"
      sm-gap="1.2em"
      style="flex-grow: 1"
    >
      <h4 style="margin-top: 1.5em; width: 25vw; min-width: 280px">
        ENTER APP NAME
      </h4>
      <v-text-field
        v-model="appName"
        strong
        style="width: 20vw; min-width: 300px; max-width: 400px; margin-top: 1em"
        :messageType="appNameError ? 'error' : ''"
        message="App name is required"
        @keyup.enter="onEnterClick"
        placeholder="Enter app name"
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
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import VButton from "@/components/lib/VButton/VButton.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VStack from "@/components/lib/VStack/VStack.vue";
import VTextField from "@/components/lib/VTextField/VTextField.vue";

export default {
  name: "ConfigureAppName",
  components: { VTextField, VCard, VButton, VStack },
  props: {
    isConfigured: Boolean,
  },
  setup(props, { emit }) {
    const store = useStore();
    const appName = ref("");

    const appNameError = computed(() => {
      return store.getters.appNameError;
    });

    appName.value = store.getters.appName;

    function onEnterClick() {
      emit("enter-click");
    }

    watch(
      () => appName.value,
      () => {
        store.dispatch("updateAppName", appName.value);
        if (!appName.value?.trim()) {
          store.dispatch("updateAppNameError", true);
        } else {
          store.dispatch("updateAppNameError", false);
        }
        if (props.isConfigured && !store.getters.onConfigChange) {
          store.dispatch("configChangeDetected");
        }
      }
    );

    return {
      appName,
      appNameError,
      onEnterClick,
    };
  },
};
</script>