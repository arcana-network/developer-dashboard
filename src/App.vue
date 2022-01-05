<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <full-screen-loader v-if="loading" :message="loadingMessage" />
  </div>
</template>

<script>
import { onBeforeMount, ref } from "@vue/runtime-core";
import { getConfig } from "@/services/app-config.service";
import { useStore } from "vuex";
import { stringToBuffer } from "@/utils/cryptoUtils";
import { fetchAndStoreAppConfig } from "@/services/app-config.service";
import FullScreenLoader from "@/components/FullScreenLoader.vue";

export default {
  components: { FullScreenLoader },
  setup() {
    const store = useStore();
    const loading = ref("");
    const loadingMessage = ref("");

    onBeforeMount(async () => {
      const encodedAccessToken = localStorage.getItem("access-token");
      const userInfo = localStorage.getItem("user-info");
      if (encodedAccessToken && userInfo) {
        const accessToken = new TextDecoder().decode(
          stringToBuffer(encodedAccessToken)
        );
        store.dispatch("updateAccessToken", accessToken);
        store.dispatch("updateUserInfo", JSON.parse(userInfo));
      }

      if (!store.getters["test/forwarder"] || !store.getters["test/rpc"]) {
        const configResponse = await getConfig();
        const config = configResponse.data;
        store.dispatch("test/updateForwarder", config?.Forwarder);
        store.dispatch("test/updateRPCUrl", config?.RPC_URL);
      }

      if (!store.getters.appName && store.getters.accessToken) {
        loading.value = true;
        loadingMessage.value = "Fetching app configuration...";
        await fetchAndStoreAppConfig();
        loading.value = false;
      }
    });

    return {
      loading,
      loadingMessage,
    };
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