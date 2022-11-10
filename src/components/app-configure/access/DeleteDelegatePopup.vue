<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import type { Delegate } from '@/stores/apps.store'
import { truncate } from '@/utils/stringUtils'

type DeleteDelegateProps = {
  delegate: Delegate
}

const emit = defineEmits(['close', 'delete'])

const props = defineProps<DeleteDelegateProps>()
</script>

<template>
  <VOverlay>
    <VCard class="modal-card">
      <header class="flex flex-grow justify-space-between">
        <div class="sub-heading-1 title">Delete a delegation</div>
        <img
          src="@/assets/iconography/close.svg"
          class="close-icon"
          @click.stop="emit('close')"
        />
      </header>
      <VSeperator class="separator" />
      <main>
        <div class="body-1 description">
          Please note deleting the delegates will also delete any unused keys as
          well. Please review the following before proceeding:
        </div>
        <VStack direction="column" gap="1.25rem">
          <VStack direction="column" gap="0.625rem" align="center">
            <div class="body-1 key">Name</div>
            <div class="body-1 value">{{ props.delegate.name }}</div>
          </VStack>
          <VStack direction="column" gap="0.625rem" align="center">
            <div class="body-1 key">Address</div>
            <div class="body-1 value">
              {{ truncate(props.delegate.address, 6) }}
            </div>
          </VStack>
        </VStack>
      </main>
      <footer class="flex sm-column flex-grow">
        <VButton
          v-wave
          variant="secondary"
          label="CANCEL"
          @click.stop="emit('close')"
        />
        <VButton
          v-wave
          variant="primary"
          label="DELETE"
          @click.stop="emit('delete', props.delegate.id)"
        />
      </footer>
    </VCard>
  </VOverlay>
</template>

<style scoped>
.modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  flex-direction: column;
  gap: 1vh;
  width: 72%;
  min-width: 200px;
  max-width: 480px;
  padding: 2rem;
  overflow-x: hidden;
  transform: translate(-50%, -50%);
}

.separator {
  width: 100vw;
  margin-inline: -2rem;
  margin-top: 2rem;
  border-color: rgb(141 141 141 / 20%);
}

.close-icon {
  width: 1.125rem;
  cursor: pointer;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
}

main {
  padding-block: 1.25rem;
}

.description {
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-grey);
}

.key {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-grey);
}

.value {
  font-size: 1.5rem;
  font-weight: 500;
}

footer {
  gap: 1rem;
  align-items: center;
  justify-content: end;
  margin-top: 2.5rem;
}
</style>
