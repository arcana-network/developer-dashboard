<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const emit = defineEmits(['cancel', 'switch'])
</script>

<template>
  <VOverlay>
    <div class="popup-container">
      <VCard class="popup-card">
        <img
          src="@/assets/iconography/hazard-sign-icon.png"
          style="width: 8rem"
        />
        <h3 class="popup-title">Warning!</h3>
        <span class="popup-message">
          Attempting to switch between App-Specific & Global Keys. Please be
          aware that doing so will change your user's wallet
        </span>
        <VStack gap="1.25rem">
          <VButton
            variant="secondary"
            label="CANCEL"
            style="width: 120px"
            @click.stop="emit('cancel')"
          />
          <VButton
            label="SWITCH"
            style="width: 120px"
            @click.stop="emit('switch')"
          />
        </VStack>
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
  font-size: 20px;
  line-height: 1.5;
  color: var(--text-white);
  text-align: center;
}
</style>
