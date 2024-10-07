<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const emit = defineEmits(['cancel', 'proceed'])
</script>

<template>
  <VOverlay>
    <div class="flex items-center justify-center w-full h-full">
      <VCard class="flex flex-col items-center w-full max-w-px480 p-8">
        <h3 class="mb-2 text-px35 text-center">Are you sure?</h3>
        <span
          class="max-w-px500 mt-2 mb-10 text-base leading-6 text-center text-white_solid-default"
        >
          This action will delete your saved card. You'll need to add a card
          again to continue your billing cycle.
        </span>
        <VStack gap="1.25rem">
          <VButton
            variant="secondary"
            label="CANCEL"
            class="w-px120"
            @click.stop="emit('cancel')"
          />
          <VButton
            label="DELETE"
            class="w-px120"
            @click.stop="emit('proceed')"
          />
        </VStack>
      </VCard>
    </div>
  </VOverlay>
</template>
