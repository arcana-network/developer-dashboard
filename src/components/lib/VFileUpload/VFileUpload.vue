<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'

import VCard from '@/components/lib/VCard/VCard.vue'
import VCircularProgress from '@/components/lib/VCircularProgress/VCircularProgress.vue'

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
  <VCard
    v-if="props.value"
    variant="depressed"
    class="rounded-[10px] p-4 space-x-1"
  >
    <p
      class="text-lg font-normal text-ellipsis overflow-hidden h-auto flex-1"
      :title="props.value"
    >
      {{ props.value }}
    </p>
    <img
      src="@/assets/iconography/close.svg"
      class="cursor-pointer"
      @click.stop="handleRemoveFile"
    />
  </VCard>
  <VCard
    v-else
    variant="depressed"
    class="w-full cursor-pointer p-4 justify-between"
    @click.stop="handleUploadClick"
  >
    <span class="text-lg font-normal text-ellipsis h-7">
      {{ props.placeholder }}
    </span>
    <img v-if="!props.isLoading" src="@/assets/iconography/upload.svg" />
    <VCircularProgress v-else size="1.5rem" stroke="0.5rem" />
  </VCard>
</template>
