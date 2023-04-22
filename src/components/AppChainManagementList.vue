<script setup lang="ts">
import { ref, toRefs } from 'vue'

import MoreIcon from '@/assets/iconography/more.svg'
import VSwitchVue from '@/components/lib/VSwitch/VSwitch.vue'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useClickOutside } from '@/use/clickOutside'

const emits = defineEmits(['edit', 'delete'])

const chainManagementStore = useChainManagementStore()
const { areChainsEmpty, filteredChains } = toRefs(chainManagementStore)
const showRowOptionsOf = ref(null)
const showRowOptions_menu = ref(null)

const rowOptions = [
  {
    label: 'Edit',
    value: 0,
  },
  {
    label: 'Delete',
    value: 1,
  },
  {
    label: 'Set as Default',
    value: 2,
  },
]

useClickOutside(showRowOptions_menu, () => {
  showRowOptionsOf.value = null
})

function onClickOfOption(option: string, chainId: string) {
  if (option === 'Edit') emits('edit', { chainId })
  if (option === 'Delete') emits('delete', { chainId })
  showRowOptionsOf.value = null
}
</script>

<template>
  <div v-if="areChainsEmpty" class="text-white">
    <p class="text-center p-3">No Chains Available</p>
  </div>
  <div
    v-else
    class="table-container | rounded-md border-[1px] border-[#363636]"
  >
    <table
      class="table-fixed text-white overflow-x-auto border-collapse w-full"
    >
      <thead class="border-b-[1px] border-b-[#363636]">
        <tr class="text-[#8d8d8d]">
          <th class="w-[15%]">Name</th>
          <th class="w-[5%]">ID</th>
          <th class="w-[10%]">Symbol</th>
          <th class="w-[10%]">Compatibility</th>
          <th class="w-[10%]">Type</th>
          <th>RPC URL</th>
          <th class="w-[10%]">Enabled</th>
          <th class="w-[5%]"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="chain in filteredChains"
          :key="chain.chain_id"
          class="hover:bg-[#363636]"
        >
          <td>{{ chain.name }}</td>
          <td>{{ chain.id }}</td>
          <td>{{ chain.currency }}</td>
          <td>{{ chain.compatibility }}</td>
          <td>{{ chain.chain_type }}</td>
          <td>{{ chain.rpc_url }}</td>
          <td><VSwitchVue :value="chain.status === 'true'" /></td>
          <td>
            <div class="relative">
              <button
                class="flex justify-center items-center cursor-pointer w-7 h-7 bg-[#262626] rounded-[5px]"
                @click.stop="showRowOptionsOf = chain.id"
              >
                <img :src="MoreIcon" alt="more" />
              </button>
              <dialog
                v-if="chain.id === showRowOptionsOf"
                ref="showRowOptions_menu"
                open
                class="flex flex-col bg-[#1F1F1F] text-[#FFFFFF] rounded-md border-[1px] border-[#363636] p-2 space-y-1 absolute w-32 left-[-100px] top-[10px] z-[999]"
              >
                <button
                  v-for="option in rowOptions"
                  :key="option.value"
                  class="p-1 rounded-[5px] hover:bg-[#363636] text-left"
                  @click.stop="() => onClickOfOption(option.label, chain.id)"
                >
                  {{ option.label }}
                </button>
              </dialog>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th,
td {
  padding: 15px;
  text-align: left;
}

th {
  font-size: 12px;
  font-weight: 400;
}

td {
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
}
</style>
