<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'

function handleMainnetKeySpace() {
  //
}
</script>

<template>
  <VOverlay>
    <div class="popup-container">
      <VCard class="popup-card">
        <img src="@/assets/success-celebrate.svg" style="width: 8rem" />
        <h3 class="popup-title">Mainnet App Created!</h3>
        <span class="popup-message">
          Mainnet app has been configured. <br />Please proceed to configure
          your app's keyspace
        </span>
        <VButton
          label="CONFIGURE KEYSPACE"
          style="width: 200px"
          @click.stop="handleMainnetKeySpace()"
        />
      </VCard>
    </div>
  </VOverlay>
</template>

<style scoped>
.popup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.popup-card {
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.popup-title {
  margin-block: 10px;
  font-size: 35px;
  text-align: center;
}

.popup-message {
  max-width: 500px;
  margin-top: 10px;
  margin-bottom: 64px;
  font-family: var(--font-body);
  font-size: 20px;
  line-height: 1.5;
  color: var(--text-white);
  text-align: center;
}
</style>
