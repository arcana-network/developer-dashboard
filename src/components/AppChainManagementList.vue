<script setup lang="ts">
import { ref } from 'vue'

import ChainIcon from '@/assets/iconography/github.svg'
import MoreIcon from '@/assets/iconography/more.svg'
import VSwitchVue from '@/components/lib/VSwitch/VSwitch.vue'
import { useClickOutside } from '@/use/clickOutside'

const enable = ref(false)
const showRowOptions = ref(false)
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
  showRowOptions.value = false
})
</script>

<template>
  <div class="table-container | rounded-md">
    <table
      class="table-fixed text-white overflow-x-auto border-collapse w-full"
    >
      <thead>
        <tr>
          <th class="w-[5%]"></th>
          <th class="w-[15%]">Name</th>
          <th>Network</th>
          <th>ID</th>
          <th>Symbol</th>
          <th>Compatibility</th>
          <th>Type</th>
          <th>RPC URL</th>
          <th>Enabled</th>
          <th class="w-[5%]"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-[#363636]">
          <td>
            <img :src="ChainIcon" alt="chain icon" class="w-6 h-6" />
          </td>
          <td class="text-ellipsis">Polygon Mainnet</td>
          <td class="text-ellipsis">Polygon POS</td>
          <td class="text-ellipsis">137</td>
          <td class="text-ellipsis">MATIC</td>
          <td class="text-ellipsis">EVM</td>
          <td class="text-ellipsis">Mainnet</td>
          <td class="text-ellipsis">https://polygon-rpc.com</td>
          <td><VSwitchVue v-model:model-value="enable" /></td>
          <td>
            <div class="relative">
              <button
                class="flex justify-center items-center cursor-pointer w-7 h-7 bg-[#262626] rounded-[5px]"
                @click.stop="showRowOptions = !showRowOptions"
              >
                <img :src="MoreIcon" alt="more" />
              </button>
              <dialog
                v-if="showRowOptions"
                ref="showRowOptions_menu"
                open
                class="flex flex-col bg-[#1F1F1F] text-[#FFFFFF] rounded-md border-[1px] border-[#363636] p-2 space-y-1 absolute w-32 left-[-100px] top-[10px]"
              >
                <button
                  v-for="option in rowOptions"
                  :key="option.value"
                  class="p-1 rounded-[5px] hover:bg-[#363636] text-left"
                  @click.stop="showRowOptions = false"
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
.table-container {
  border: 1px solid #363636;
}

th,
td {
  padding: 15px;
  text-align: left;
}

thead {
  border-bottom: 1px solid #363636;
}

th {
  font-size: 12px;
  font-weight: 400;
  color: #8d8d8d;
}

td {
  font-size: 14px;
  font-weight: 500;
}
</style>
