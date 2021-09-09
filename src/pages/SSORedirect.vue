<template>
  <div class="body-1">Redirecting...</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
export default {
  setup() {
    onMounted(() => {
      const { AuthProvider } = window.arcana_login;

      window.onload = () => {
        AuthProvider.handleRedirectPage();
      };
    });
  },
};
</script>