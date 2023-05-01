<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const emit = defineEmits(['cancel', 'proceed'])
</script>

<template>
  <VOverlay>
    <div class="popup-container">
      <VCard class="popup-card">
        <h3 class="popup-title">Are you sure?</h3>
        <span class="popup-message">
          This action will delete your saved card. You'll need to add a card
          again to continue your billing cycle.
        </span>
        <VStack gap="1.25rem">
          <VButton
            variant="secondary"
            label="CANCEL"
            style="width: 120px"
            @click.stop="emit('cancel')"
          />
          <VButton
            label="DELETE"
            style="width: 120px"
            @click.stop="emit('proceed')"
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
  max-width: 480px;
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
  margin-bottom: 40px;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-white);
  text-align: center;
}
</style>
