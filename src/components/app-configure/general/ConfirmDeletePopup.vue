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
    class="lg:text-[2rem] md:text-[1.25rem] max-[768px]:text-[1.125rem] font-bold flex-1 flex justify-center"
  >
    <div
      class="text-ellipsis overflow-hidden max-w-full"
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
  <footer class="flex sm-column flex-1">
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
