<script setup lang="ts">
import { toRefs, ref } from 'vue'
import { useRoute } from 'vue-router'

import ChainFallbackLogo from '@/assets/chain-fallback-logo.png'
import MoreIcon from '@/assets/iconography/more.svg'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import { getChainLogo } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useGaslessStore } from '@/stores/gasless.store'
import { useClickOutside } from '@/use/clickOutside'

const emits = defineEmits([
  'deposit',
  'withdraw',
  'edit',
  'delete',
  'toggle-chain-status',
  'manage-whitelist',
])

const gaslessStore = useGaslessStore()
const { gastankList } = toRefs(gaslessStore)
const showRowOptionsOf = ref(null)
const showRowOptions_menu = ref(null)
const route = useRoute()
const appStore = useAppsStore()
const appId = route.params.appId
const app = appStore.app(appId)

useClickOutside(showRowOptions_menu, () => {
  showRowOptionsOf.value = null
})

const rowOptions = [
  {
    label: 'Deposit',
    value: 0,
  },
  {
    label: 'Withdraw',
    value: 1,
  },
  {
    label: 'Edit',
    value: 2,
  },
  {
    label: 'Delete',
    value: 3,
  },
  {
    label: 'Manage Whitelist',
    value: 4,
  },
]

function onChainLogoError(e) {
  e.target.src = ChainFallbackLogo
}
</script>

<template>
  <div class="rounded-md border-[1px] border-[#363636]">
    <table
      v-if="gastankList.length"
      class="table-fixed text-white block overflow-x-auto border-collapse w-full"
    >
      <thead class="border-b-[1px] border-b-[#363636]">
        <tr class="text-[#8d8d8d] text-xs">
          <th class="w-[5%]"></th>
          <th class="w-[10%]">Name</th>
          <th class="w-[15%]">Network</th>
          <th class="w-[10%]">Type</th>
          <th class="w-[10%]">Balance</th>
          <th class="w-[20%]">Deposit Address</th>
          <th class="w-[10%]">Whitelists</th>
          <th class="w-[10%]">Last Transaction Date</th>
          <th class="w-[10%]">Enabled</th>
          <th class="w-[5%]"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tank in gastankList"
          :key="tank.name"
          class="hover:bg-[#363636]"
        >
          <td>
            <img
              :src="getChainLogo(tank.chainId, app.network)"
              alt="chain logo"
              class="w-8"
              @error="onChainLogoError"
            />
          </td>
          <td>{{ tank.name }}</td>
          <td>{{ tank.network }}</td>
          <td>{{ tank.type }}</td>
          <td>{{ '-' }}</td>
          <td>{{ tank.deposit_address || '-' }}</td>
          <td>{{ tank.whitelists || '-' }}</td>
          <td>{{ '-' }}</td>
          <td>
            <VSwitch :value="false" />
          </td>
          <td>
            <div class="relative">
              <button
                class="flex justify-center items-center cursor-pointer w-7 h-7 bg-[#262626] rounded-[5px]"
                @click.stop="showRowOptionsOf = tank.id"
              >
                <img :src="MoreIcon" alt="more" />
              </button>
              <dialog
                v-if="tank.id === showRowOptionsOf"
                ref="showRowOptions_menu"
                open
                class="flex flex-col bg-[#1F1F1F] text-[#FFFFFF] rounded-md border-[1px] border-[#363636] p-2 space-y-1 absolute w-36 left-[-100px] top-[10px] z-[999]"
              >
                <button
                  v-for="option in rowOptions"
                  :key="option.value"
                  class="p-1 rounded-[5px] hover:bg-[#363636] text-left"
                >
                  {{ option.label }}
                </button>
              </dialog>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="h-40 flex justify-center items-center">
      <p class="text-[#8D8D8D]">Begin by Adding a Gas Tank</p>
    </div>
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
