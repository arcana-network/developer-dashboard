<template>
  <main>
    <v-overlay>
      <div
        class="flex column"
        style="
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: var(--text-white);
        "
      >
        <h1
          style="
            color: #13a3fd;
            letter-spacing: unset;
            font-weight: 700;
            text-align: center;
            padding: 0 1em;
          "
        >
          Under Maintenance
        </h1>
        <h2
          style="
            font-weight: 500;
            text-align: center;
            padding: 0 1em;
            margin: 1.25em auto 0;
            max-width: 720px;
          "
        >
          The dashboard is currently undergoing maintenance and will be back
          online soon. Please check back in a little while.
        </h2>
        <!-- <h4 class="down-description">
          DISCLAIMER: Use with caution. This is an ALPHA release with all
          features being experimental. Please do not use important data without
          back ups.
        </h4>
        <h5 class="down-description">
          The platform is provided in an "as is" basis without any express or
          implied warranty of any kind including warranties of merchantability
          or fitness of purpose. In no event will Arcana Networks or its
          subsidiaries be held responsible for any damages. BY CLICKING
          "Configure" below, you accept the same.
        </h5> -->
      </div>
    </v-overlay>
  </main>
</template>

<style scoped>
.down-description {
  font-family: var(--font-body);
  font-weight: 400;
  margin-top: 1.1em;
  line-height: 1.5em;
  min-width: 320px;
  max-width: 720px;
  width: 90%;
  text-align: center;
}

h4.down-description {
  font-weight: 600;
  font-size: 1.125em;
}
h5.down-description {
  font-weight: 400;
  font-size: 0.85em;
}
</style>

<script>
import VOverlay from "../components/lib/VOverlay/VOverlay.vue";

export default {
  name: "AppDownNotification",
  components: { VOverlay },
  setup() {},
};
</script>
