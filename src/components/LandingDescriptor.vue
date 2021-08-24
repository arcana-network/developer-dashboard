<template>
  <div
    class="mobile-remove tablet-remove"
    style="
      width: 40%;
      max-width: 488px;
      min-width: 400px;
      margin-top: 12vh;
      margin-left: 4vw;
    "
  >
    <img :src="AppLogo" style="height: 72px" alt="Arcana Logo" />
    <h1 style="margin-top: 10vh; margin-right: 4vw">
      Make your dApps secure from the ground up!
    </h1>
    <div class="body-3" style="margin-top: 3vh">
      Lorem ipsum dolor sit amet,<br />
      consectetuer adipiscing elit,
    </div>
    <div
      style="
        margin-top: 10vh;
        margin-bottom: 4vh;
        height: 24vh;
        margin-right: 4vw;
        background-color: #2b2828;
      "
    ></div>
  </div>
  <v-seperator
    :vertical="true"
    style="height: 99.4vh; position: sticky; top: 0"
    class="mobile-remove tablet-remove"
  />
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
</style>

<script>
import VSeperator from "./lib/VSeperator/VSeperator.vue";
import AppLogo from "../assets/logo.svg";
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