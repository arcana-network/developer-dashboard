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
  <header class="sub-heading-1 flex-grow">
    <div
      class="text-ellipsis"
      style="max-width: 100%"
      :title="`Delete app - ${appsStore.app(props.appId as number).name}`"
    >
      Delete app - {{ appsStore.app(props.appId as number).name }}
    </div>
  </header>
  <VSeperator />
  <main class="body-3">
    Deleting the app will remove all the assets that have been uploaded by your
    application and it's users, remove public and private keys assigned to users
    and any access controls that may have been set.
    <br /><br />
    Please press 'Delete' to confirm this action.
  </main>
  <footer class="flex sm-column flex-grow">
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

<style scoped>
header {
  display: flex;
  justify-content: center;
}

main {
  padding: 2vw;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: center;
}

footer {
  gap: 2vh;
  align-items: center;
  justify-content: center;
}
</style>
