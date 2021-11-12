<template>
  <v-overlay>
    <div
      style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
    >
      <v-circular-progress color="var(--primary)" size="6em" />
      <h4 style="margin-top: 1em">{{ message }}</h4>
    </div>
  </v-overlay>
</template>

<script>
import VCircularProgress from "./lib/VCircularProgress/VCircularProgress.vue";
import VOverlay from "./lib/VOverlay/VOverlay.vue";
export default {
  name: "FullScreenLoader",
  components: { VOverlay, VCircularProgress },
  props: {
    message: String,
  },
};
</script>