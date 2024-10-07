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
  <div class="rounded-md border-px1 bg-white border-system-light_gray">
    <table
      v-if="gastankList.length"
      class="table-fixed text-black_solid-default block overflow-x-auto border-collapse"
    >
      <thead class="border-b-px1 border-b-system-light_gray">
        <tr class="text-system-grey">
          <th class="w-5% p-px15 text-left text-px12 font-normal"></th>
          <th class="w-20% p-px15 text-left text-px12 font-normal">Name</th>
          <th class="w-20% p-px15 text-left text-px12 font-normal">Network</th>
          <th class="w-15% p-px15 text-left text-px12 font-normal">Type</th>
          <th class="w-15% p-px15 text-left text-px12 font-normal">Owner</th>
          <th class="w-5% p-px15 text-left text-px12 font-normal">
            Whitelists
          </th>
          <th class="w-15% p-px15 text-left text-px12 font-normal">
            Enable Smart Account
          </th>
          <th class="w-10% p-px15 text-left text-px12 font-normal"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tank in filteredGastankList"
          :key="tank.name"
          class="hover:bg-firefly-default"
        >
          <td class="p-px15 text-left text-px14 font-medium overflow-ellipsis">
            <img
              :src="getChainLogo(tank.chainId, 'evm', app.network)"
              alt="chain logo"
              class="w-8"
              @error="onChainLogoError"
            />
          </td>
          <td class="p-px15 text-left text-px14 font-medium overflow-ellipsis">
            {{ tank.name }}
          </td>
          <td class="p-px15 text-left text-px14 font-medium overflow-ellipsis">
            {{ tank.network }}
          </td>
          <td class="p-px15 text-left text-px14 font-medium overflow-ellipsis">
            {{ tank.type }}
          </td>
          <td
            class="p-px15 text-left text-px14 font-medium overflow-ellipsis"
            :title="tank.owner"
          >
            {{ shrinkWalletAddress(tank.owner) }}
          </td>
          <td class="p-px15 text-left text-px14 font-medium overflow-ellipsis">
            {{ tank.whitelists || '-' }}
          </td>
          <td class="p-px15 text-left text-px14 font-medium overflow-ellipsis">
            <VSwitch
              :value="tank.enabled"
              @update:model-value="() => emits('toggle-chain-status', tank)"
            />
          </td>
          <td class="p-px15 text-left text-px14 font-medium overflow-ellipsis">
            <PopperJs placement="left-start" :arrow="true">
              <button
                class="flex justify-center items-center cursor-pointer w-7 h-7 bg-black rounded-px5"
              >
                <img :src="MoreIcon" alt="more" />
              </button>
              <template #content>
                <ul
                  ref="showRowOptions_menu"
                  class="flex flex-col bg-white text-black_solid-default rounded-md border-px1 border-system-light_gray p-2 space-y-1 absolute w-36 left-px-100 top-px10 z-mid-overlay"
                >
                  <li
                    v-for="option in rowOptions"
                    :key="option.value"
                    class="p-1 rounded-px5 hover:bg-whitemist-default text-left cursor-pointer"
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
        class="table-fixed text-white_solid-default overflow-x-auto border-collapse"
      >
        <thead class="border-b-px1 border-b-system-light_gray">
          <tr class="text-system-grey">
            <th class="w-14% p-px15 text-left text-px12 font-normal">Name</th>
            <th class="w-14% p-px15 text-left text-px12 font-normal">
              Balance
            </th>
            <th class="w-14% p-px15 text-left text-px12 font-normal">
              Deposit Address
            </th>
            <th class="w-14% p-px15 text-left text-px12 font-normal">
              Network
            </th>
            <th class="w-14% p-px15 text-left text-px12 font-normal">Type</th>
            <th class="w-14% p-px15 text-left text-px12 font-normal">
              Last Transaction Date
            </th>
            <th class="w-14% p-px15 text-left text-px12 font-normal">
              Whitelists
            </th>
          </tr>
        </thead>
      </table>
      <div class="flex-1 flex justify-center items-center">
        <p class="text-system-grey">Begin by Adding a Gas Tank</p>
      </div>
    </div>
  </div>
</template>
