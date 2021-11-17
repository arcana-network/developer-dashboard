<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { onBeforeMount, watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { getConfig } from "./services/app-config.service";
import { useStore } from "vuex";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    onBeforeMount(() => {
      if (!store.getters["test/forwarder"] || !store.getters["test/rpc"]) {
        getConfig().then((res) => {
          const config = res.data;
          // Later use store.getters.env to update according to env
          store.dispatch("test/updateForwarder", config?.Forwarder);
          store.dispatch("test/updateRPCUrl", config?.RPC_URL);
        });
      }
    });

    watch(route, () => {
      const app = document.getElementById("app");
      if (app) app.style.overflowY = "hidden";
      setTimeout(() => {
        if (app) app.style.overflowY = "auto";
        app.scrollTo({ top: 0 });
      }, 1000);
    });
  },
};
</script>

<style>
#app {
  height: 100vh;
  overflow-x: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>