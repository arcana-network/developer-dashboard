<template>
  <div class="mobile-remove tablet-remove" style="
      width: 40%;
      max-width: 488px;
      min-width: 400px;
      margin-top: 8vh;
      margin-left: 4vw;
    ">
    <img :src="AppLogo" style="height: 72px" alt="Arcana Logo" />
    <h1 style="margin-top: 4vh; margin-right: 4vw">
      Make your dApps secure from the ground up!
    </h1>
    <img src="@/assets/sidebar-illustration.png" style="margin: 6vh auto 0" />
  </div>
  <v-seperator :vertical="true" style="height: 99.4vh; position: sticky; top: 0" class="mobile-remove tablet-remove" />
</template>

<style scoped>
h1 {
  letter-spacing: unset;
  font-weight: 700;
}

.body-3 {
  font-size: 0.9em;
  font-weight: 300;
  line-height: 1.8em;
}

ul {
  list-style-type: "-  ";
  padding: 0;
  margin-right: 2em;
}

ul li {
  margin: 4px;
}
</style>

<script lang="ts">
import VSeperator from "@/components/lib/VSeperator/VSeperator.vue";
import AppLogo from "@/assets/logo.svg";

export default {
  name: "LandingDescriptor",
  components: { VSeperator },
  setup() {
    return {
      AppLogo,
    };
  },
};
</script>
