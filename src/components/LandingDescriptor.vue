<script lang="ts" setup>
import AppLogo from '@/assets/logo.svg'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
</script>

<template>
  <div class="mobile-remove tablet-remove landing-descriptor">
    <img :src="AppLogo" style="height: 72px" alt="Arcana Logo" />
    <h1 style="margin-top: 4vh; margin-right: 4vw">
      Make your dApps secure from the ground up!
    </h1>
    <img src="@/assets/sidebar-illustration.png" style="margin: 6vh auto 0" />
  </div>
  <VSeperator :vertical="true" class="mobile-remove tablet-remove separator" />
</template>

<style scoped>
.landing-descriptor {
  width: 40%;
  min-width: 400px;
  max-width: 488px;
  margin-top: 8vh;
  margin-left: 4vw;
}

.separator {
  position: sticky;
  top: 0;
  height: calc(100vh - 5rem);
}

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
