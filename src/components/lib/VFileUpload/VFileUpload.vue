<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'

import VCard from '@/components/lib/VCard/VCard.vue'
import VCircularProgress from '@/components/lib/VCircularProgress/VCircularProgress.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

type FileUploadProps = {
  placeholder?: string
  value?: string
  multiple?: boolean
  allowedFileType?: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  placeholder: 'Choose file to upload',
  multiple: false,
  value: '',
  allowedFileType: '*',
  isLoading: false,
})

const emit = defineEmits(['change-file', 'remove-file'])

let file: HTMLInputElement

onMounted(() => {
  file = document.createElement('input')
  file.type = 'file'
  file.hidden = true
  file.accept = props.allowedFileType
  file.multiple = props.multiple
  file.onchange = fileChangeHandler
})

function fileChangeHandler(event: any) {
  emit('change-file', event.target.files)
}

function handleUploadClick() {
  file.click()
}

function handleRemoveFile() {
  emit('remove-file')
}

onBeforeUnmount(() => {
  file.remove()
})
</script>

<template>
  <VCard v-if="props.value" variant="depressed" class="file-upload-card">
    <VStack gap="2rem" justify="space-between" align="center" class="flex-1">
      <span class="text-lg font-normal text-ellipsis" :title="props.value">{{
        props.value
      }}</span>
      <img
        src="@/assets/iconography/close.svg"
        class="cursor-pointer"
        @click.stop="handleRemoveFile"
      />
    </VStack>
  </VCard>
  <VCard
    v-else
    variant="depressed"
    class="file-upload-card cursor-pointer"
    @click.stop="handleUploadClick"
  >
    <VStack gap="2rem" justify="space-between" align="center" class="flex-1">
      <span class="text-lg font-normal text-ellipsis">
        {{ props.placeholder }}
      </span>
      <img v-if="!props.isLoading" src="@/assets/iconography/upload.svg" />
      <VCircularProgress v-else size="1.5rem" stroke="0.5rem" />
    </VStack>
  </VCard>
</template>

<style scoped>
.file-upload-card {
  padding: 0.875rem 1rem 0.875rem 2rem;
  border-radius: 10px;
}

.file-upload-card > * {
  width: 100%;
}
</style>
