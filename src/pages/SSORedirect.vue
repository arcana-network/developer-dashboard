<template>
  <div class="body-1">Redirecting...</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import constants from "../utils/constants";
import { AuthProvider } from "@arcana/auth";

export default {
  setup() {
    onMounted(() => {
      AuthProvider.handleRedirectPage(constants.origin);
    });
  },
};
</script>