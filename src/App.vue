<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();

    watch(route, () => {
      const app = document.getElementById("app");
      if (app) app.style.overflowY = "hidden";
      setTimeout(() => {
        if (app) app.style.overflowY = "auto";
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