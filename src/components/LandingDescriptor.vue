<script lang="ts" setup>
import AppLogo from '@/assets/logo.svg'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
</script>

<template>
  <div
    class="mobile-remove tablet-remove"
    style="
      width: 40%;
      min-width: 400px;
      max-width: 488px;
      margin-top: 8vh;
      margin-left: 4vw;
    "
  >
    <img :src="AppLogo" style="height: 72px" alt="Arcana Logo" />
    <h1 style="margin-top: 4vh; margin-right: 4vw">
      Make your dApps secure from the ground up!
    </h1>
    <img src="@/assets/sidebar-illustration.png" style="margin: 6vh auto 0" />
  </div>
  <v-seperator
    :vertical="true"
    style="position: sticky; top: 0; height: 99.4vh"
    class="mobile-remove tablet-remove"
  />
</template>

<style scoped>
h1 {
  font-weight: 700;
  letter-spacing: unset;
}

.body-3 {
  font-size: 0.9em;
  font-weight: 300;
  line-height: 1.8em;
}

ul {
  padding: 0;
  margin-right: 2em;
  list-style-type: '-  ';
}

ul li {
  margin: 4px;
}
</style>
