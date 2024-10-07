<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const emit = defineEmits(['cancel', 'switch'])
</script>

<template>
  <VOverlay>
    <div class="flex items-center justify-center w-full h-full">
      <VCard class="flex flex-col items-center w-full max-w-px600 p-8">
        <img src="@/assets/iconography/hazard-sign-icon.png" class="w-32" />
        <h3 class="my-px10 text-px35 text-center">Warning!</h3>
        <span
          class="max-w-px500 mt-px10 mb-16 text-px20 leading-1.5 text-center text-black_solid-default"
        >
          Attempting to switch between App-Specific & Global Keys. Please be
          aware that doing so will change your user's wallet
        </span>
        <VStack gap="1.25rem">
          <VButton
            variant="secondary"
            label="CANCEL"
            class="w-px120"
            @click.stop="emit('cancel')"
          />
          <VButton
            label="SWITCH"
            class="w-px120"
            @click.stop="emit('switch')"
          />
        </VStack>
      </VCard>
    </div>
  </VOverlay>
</template>
