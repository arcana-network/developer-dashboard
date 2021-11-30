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
import { onBeforeMount, ref, watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { getConfig } from "./services/app-config.service";
import { useStore } from "vuex";
import { stringToBuffer } from "./utils/cryptoUtils";
import { fetchAllApps, fetchApp } from "@/services/dashboard.service";
import bytes from "bytes";
import FullScreenLoader from "@/components/FullScreenLoader.vue";

export default {
  components: { FullScreenLoader },
  setup() {
    const route = useRoute();
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

        const apps = await fetchAllApps();
        if (apps.data.length) {
          store.dispatch("updateAppConfigurationStatus", true);
          const currentApp = apps.data[0];
          const appId = currentApp.ID;
          store.dispatch("updateAppName", currentApp.name);
          store.dispatch("updateAppId", currentApp.ID);

          const env = store.getters.env;
          const chainType = ["ethereum", "polygon", "binance"][
            currentApp.chain
          ];
          store.dispatch(env + "/updateChainType", chainType);
          const unlimitedBytes = 10995116277760;

          if (currentApp.storage_limit < unlimitedBytes) {
            const storage = bytes(currentApp.storage_limit, {
              unitSeparator: " ",
            });
            const storageValues = storage.split(" ");
            store.dispatch(env + "/updateStorage", {
              value: storageValues[0],
              unit: storageValues[1],
              isUnlimited: false,
            });
          } else {
            store.dispatch(env + "/updateStorage", {
              value: "",
              unit: "",
              isUnlimited: true,
            });
          }

          if (currentApp.bandwidth_limit < unlimitedBytes) {
            const bandwidth = bytes(currentApp.bandwidth_limit, {
              unitSeparator: " ",
            });
            const bandwidthValues = bandwidth.split(" ");
            store.dispatch(env + "/updateBandwidth", {
              value: bandwidthValues[0],
              unit: bandwidthValues[1],
              isUnlimited: false,
            });
          } else {
            store.dispatch(env + "/updateBandwidth", {
              value: "",
              unit: "",
              isUnlimited: true,
            });
          }

          const appDetails = await fetchApp(appId);

          if (appDetails.data.cred) {
            store.dispatch(
              env + "/updateAuthDetails",
              appDetails.data.cred.map((el) => {
                return {
                  type: el.verifier,
                  authType: el.verifier,
                  verifier: el.verifier,
                  clientId: el.clientId,
                  clientSecret: el.clientSecret,
                  redirectUrl: el.redirectUrl,
                };
              })
            );
          } else {
            store.dispatch(env + "/updateAuthDetails", []);
          }
        } else {
          store.dispatch("updateAppConfigurationStatus", false);
        }
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