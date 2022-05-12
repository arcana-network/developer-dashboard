<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'

import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

interface FileUploadProps {
  placeholder: string
  value?: string
  multiple?: boolean
  allowedFileType?: string
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  placeholder: 'Choose file to upload',
  multiple: false,
  value: '',
  allowedFileType: '*',
})

const emit = defineEmits(['file-change', 'remove-file'])

let file: HTMLInputElement

onMounted(() => {
  file = document.createElement('input')
  file.type = 'file'
  file.hidden = true
  file.accept = props.allowedFileType
  file.multiple = props.multiple
  file.onchange = fileChangeHandler
})

function fileChangeHandler(event) {
  emit('file-change', event.target.files)
}

function handleUploadClick() {
  file.click()
}

function removeFile() {
  emit('remove-file')
}

onBeforeUnmount(() => {
  file.remove()
})
</script>

<template>
  <VCard v-if="props.value" variant="elevated" class="file-upload-card">
    <VStack gap="2rem" justify="space-between" class="flex-grow">
      <span class="body-1 text-ellipsis">{{ props.value }}</span>
      <img
        src="@/assets/iconography/close.svg"
        class="cursor-pointer"
        @click.stop="removeFile"
      />
    </VStack>
  </VCard>
  <VCard
    v-else
    variant="elevated"
    class="file-upload-card cursor-pointer"
    @click.stop="handleUploadClick"
  >
    <VStack gap="2rem" justify="space-between" class="flex-grow">
      <span class="body-1 text-ellipsis">
        {{ props.placeholder }}
      </span>
      <img src="@/assets/iconography/upload.svg" />
    </VStack>
  </VCard>
</template>

<style scoped>
.file-upload-card {
  padding: 1.25rem 1rem 1.25rem 2rem;
  border-radius: 10px;
}
</style>
