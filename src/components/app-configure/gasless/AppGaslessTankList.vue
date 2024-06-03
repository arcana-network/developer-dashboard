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
import shrinkWalletAddress from '@/utils/shrinkWalletAddress'

const emits = defineEmits([
  'deposit',
  'withdraw',
  'toggle-chain-status',
  'manage-whitelist',
])

const gaslessStore = useGaslessStore()
const { gastankList, filteredGastankList } = toRefs(gaslessStore)
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
    label: 'Manage Whitelist',
    value: 2,
  },
]

function onChainLogoError(e) {
  e.target.src = ChainFallbackLogo
}

function onClickOfOption(option: number, id: number) {
  if (option === 0) emits('deposit', id)
  if (option === 1) emits('withdraw', id)
  if (option === 2) emits('manage-whitelist', id)
}
</script>

<template>
  <div class="rounded-md border-[1px] border-[#363636]">
    <table
      v-if="gastankList.length"
      class="table-fixed text-white block overflow-x-auto border-collapse"
    >
      <thead class="border-b-[1px] border-b-[#363636]">
        <tr class="text-[#8d8d8d]">
          <th class="w-[5%]"></th>
          <th class="w-[20%]">Name</th>
          <th class="w-[20%]">Network</th>
          <th class="w-[15%]">Type</th>
          <th class="w-[15%]">Owner</th>
          <th class="w-[5%]">Whitelists</th>
          <th class="w-[15%]">Enable Smart Account</th>
          <th class="w-[10%]"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tank in filteredGastankList"
          :key="tank.name"
          class="hover:bg-[#363636]"
        >
          <td>
            <img
              :src="getChainLogo(tank.chainId, 'evm', app.network)"
              alt="chain logo"
              class="w-8"
              @error="onChainLogoError"
            />
          </td>
          <td>{{ tank.name }}</td>
          <td>{{ tank.network }}</td>
          <td>{{ tank.type }}</td>
          <td :title="tank.owner">{{ shrinkWalletAddress(tank.owner) }}</td>
          <td>{{ tank.whitelists || '-' }}</td>
          <td>
            <VSwitch
              :value="tank.enabled"
              @update:model-value="() => emits('toggle-chain-status', tank)"
            />
          </td>
          <td>
            <PopperJs placement="left-start" :arrow="true">
              <button
                class="flex justify-center items-center cursor-pointer w-7 h-7 bg-[#262626] rounded-[5px]"
              >
                <img :src="MoreIcon" alt="more" />
              </button>
              <template #content>
                <ul
                  ref="showRowOptions_menu"
                  class="flex flex-col bg-[#1F1F1F] text-[#FFFFFF] rounded-md border-[1px] border-[#363636] p-2 space-y-1 absolute w-36 left-[-100px] top-[10px] z-[999]"
                >
                  <li
                    v-for="option in rowOptions"
                    :key="option.value"
                    class="p-1 rounded-[5px] hover:bg-[#363636] text-left cursor-pointer"
                    @click.stop="() => onClickOfOption(option.value, tank.id)"
                  >
                    <button>
                      {{ option.label }}
                    </button>
                  </li>
                </ul>
              </template>
            </PopperJs>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="h-40 flex flex-col">
      <table
        class="table-fixed text-white block overflow-x-auto border-collapse w-full"
      >
        <thead class="border-b-[1px] border-b-[#363636]">
          <tr class="text-[#8d8d8d]">
            <th class="w-[14%]">Name</th>
            <th class="w-[14%]">Balance</th>
            <th class="w-[14%]">Deposit Address</th>
            <th class="w-[14%]">Network</th>
            <th class="w-[14%]">Type</th>
            <th class="w-[14%]">Last Transaction Date</th>
            <th class="w-[14%]">Whitelists</th>
          </tr>
        </thead>
      </table>
      <div class="flex-1 flex justify-center items-center">
        <p class="text-[#8D8D8D]">Begin by Adding a Gas Tank</p>
      </div>
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
