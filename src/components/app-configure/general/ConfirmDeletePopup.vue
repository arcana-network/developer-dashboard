<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import { useAppsStore } from '@/stores/apps.store'

type DeleteProp = {
  appId?: number
}

const props = defineProps<DeleteProp>()
const emit = defineEmits(['cancel', 'proceed'])

const appsStore = useAppsStore()
</script>

<template>
  <header
    class="lg:text-rem2 md:text-rem1.25 max-md:text-rem1.125 font-bold flex-1 flex justify-center"
  >
    <div
      class="text-ellipsis overflow-hidden max-w-full"
      :title="`Delete app - ${appsStore.app(props.appId as number).name}`"
    >
      Delete app - {{ appsStore.app(props.appId as number).name }}
    </div>
  </header>
  <VSeperator />
  <main class="body-3 p-8 text-sm leading-6 text-center">
    Deleting the app will remove all the assets that have been uploaded by your
    application and it's users, remove public and private keys assigned to users
    and any access controls that may have been set.
    <br /><br />
    Please press 'Delete' to confirm this action.
  </main>
  <footer class="flex sm-column flex-1 gap-8 items-center justify-center">
    <VButton
      v-wave
      variant="secondary"
      label="CANCEL"
      @click.stop="emit('cancel')"
    />
    <VButton
      v-wave
      variant="primary"
      label="DELETE"
      @click.stop="emit('proceed')"
    />
  </footer>
</template>
