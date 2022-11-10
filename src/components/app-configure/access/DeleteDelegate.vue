<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const emit = defineEmits(['close'])
</script>

<template>
  <VOverlay>
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      "
    >
      <VCard popup="true" class="flex column" style="padding: 30px">
        <VStack gap="1rem" direction="column">
          <VStack justify="space-between" align="center">
            <h1 class="sub-heading-5 font-700 text-uppercase">
              Create A Delegate
            </h1>
            <Button
              style="
                cursor: pointer;
                background-color: transparent;
                border: none;
              "
              @click="emit('close')"
            >
              <img src="@/assets/iconography/close.svg" />
            </Button>
          </VStack>
          <VSeperator />
          <VStack direction="column" gap="1.5rem">
            <p class="body-3 grey">
              Provide a name, assign a key and set permissions to your delegate
              below
            </p>
            <VStack direction="column" gap="1rem" align="center">
              <VStack gap="0.5rem" direction="column" align="center">
                <label class="body-3 grey">Name</label>
                <p class="body-1">BAYC DAO</p>
              </VStack>
              <VStack gap="0.5rem" direction="column" align="center">
                <label class="body-3 grey">Address</label>
                <p class="body-1">0x60be...16f80578</p>
              </VStack>
            </VStack>
            <VStack gap="0.5rem" justify="center">
              <VButton
                label="Cancel"
                variant="secondary"
                button-style="height: 40px"
              />
              <VButton label="Delete" variant="primary" />
            </VStack>
          </VStack>
        </VStack>
      </VCard>
    </div>
  </VOverlay>
</template>

<style scoped>
p {
  margin: 0;
}

.grey {
  color: var(--text-grey);
}
</style>
