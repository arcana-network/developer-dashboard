<script lang="ts" setup>
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
</script>

<template>
  <main>
    <v-overlay>
      <div
        class="flex column"
        style="
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: var(--text-white);
        "
      >
        <h1
          style="
            padding: 0 1em;
            font-weight: 700;
            color: #13a3fd;
            text-align: center;
            letter-spacing: unset;
          "
        >
          Under Maintenance
        </h1>
        <h2
          style="
            max-width: 720px;
            padding: 0 1em;
            margin: 1.25em auto 0;
            font-weight: 500;
            line-height: 1.5em;
            text-align: center;
          "
        >
          The dashboard is currently undergoing maintenance and will be back
          online soon. Please check back in a little while.
        </h2>
      </div>
    </v-overlay>
  </main>
</template>

<style scoped>
.down-description {
  width: 90%;
  min-width: 320px;
  max-width: 720px;
  margin-top: 1.1em;
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.5em;
  text-align: center;
}

h4.down-description {
  font-size: 1.125em;
  font-weight: 600;
}

h5.down-description {
  font-size: 0.85em;
  font-weight: 400;
}
</style>
