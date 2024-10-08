<script setup lang="ts">
import { ref, toRefs, computed } from 'vue'
import { useRoute } from 'vue-router'

import ChainFallbackLogo from '@/assets/chain-fallback-logo.png'
import MoreIcon from '@/assets/iconography/more.svg'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import { useToast } from '@/components/lib/VToast'
import { getChainLogo } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useChainManagementStore } from '@/stores/chainManagement.store'
import { useClickOutside } from '@/use/clickOutside'
import { errors } from '@/utils/content'

const emits = defineEmits([
  'edit',
  'delete',
  'set-as-default',
  'toggle-chain-status',
])

const chainManagementStore = useChainManagementStore()
const {
  areChainsEmpty,
  filteredChains,
  gaslessChains,
  defaultOrderChains,
  selectedChainType,
  chainSettings,
} = toRefs(chainManagementStore)
const showRowOptionsOf = ref(null)
const showRowOptions_menu = ref(null)
const toast = useToast()
const route = useRoute()
const appStore = useAppsStore()
const appId = Number(route.params.appId)
const app = appStore.app(Number(appId))

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

const sortOrder = ref({
  column: null,
  ascending: true,
})

const sortedList = computed(() => {
  if (!sortOrder.value.column) return defaultOrderChains.value

  return filteredChains.value.slice().sort((a, b) => {
    const column = sortOrder.value.column
    const ascending = sortOrder.value.ascending

    if (column !== null) {
      if (a[column] === null) return ascending ? 1 : -1
      if (b[column] === null) return ascending ? -1 : 1

      const isBoolean = typeof a[column] === 'boolean'
      const isNumeric = !isNaN(parseFloat(a[column])) && isFinite(a[column])

      if (isBoolean) {
        const aValue = a[column] ? 1 : 0
        const bValue = b[column] ? 1 : 0
        return ascending ? aValue - bValue : bValue - aValue
      } else if (isNumeric) {
        return ascending ? a[column] - b[column] : b[column] - a[column]
      } else {
        const lowerA = a[column].toLowerCase()
        const lowerB = b[column].toLowerCase()
        return ascending
          ? lowerA.localeCompare(lowerB)
          : lowerB.localeCompare(lowerA)
      }
    }
  })
})

const chainSettingData = chainManagementStore.getChainSettings(appId, 'testnet')

const shardValue = computed(() => {
  if (app.keyspace === 'global') {
    return '-'
  }

  return chainSettings.value.shards !== null &&
    chainSettings.value.shards !== undefined &&
    chainSettings.value.shards !== 'None'
    ? chainSettings.value.shards
    : 'None'
})

const sortBy = (column: null) => {
  if (sortOrder.value.column === column) {
    sortOrder.value.ascending = !sortOrder.value.ascending
  } else {
    sortOrder.value.column = column
    sortOrder.value.ascending = true
  }
}

function onClickOfOption(option: number, id: string, chain: any) {
  if (option === 0) emits('edit', { id })
  if (option === 1) {
    if (chain.default_chain) toast.error(errors.CHAIN_MANAGEMENT.DEFAULT)
    else emits('delete', { id })
  }
  if (option === 2) {
    if (!chain.status) {
      toast.error(errors.CHAIN_MANAGEMENT.ENABLE)
    } else emits('set-as-default', { id })
  }

  showRowOptionsOf.value = null
}

function onChainToggle(chain: any) {
  emits('toggle-chain-status', {
    id: chain.id,
    status: !chain.status,
  })
}

function getRowOptions(
  isDefault: boolean,
  isBuiltIn: boolean,
  options: Array<any>
) {
  if (isDefault) return [options[0]]
  if (isBuiltIn) return [options[0], options[2]]
  return options
}

function onChainLogoError(e: any) {
  e.target.src = ChainFallbackLogo
}

function isGaslessSupport(chainId: number) {
  return app.chain_type?.toLowerCase() === 'evm' && gaslessChains.value[chainId]
}
</script>

<template>
  <div v-if="areChainsEmpty" class="text-black">
    <p class="text-center p-3">No Chains Available</p>
  </div>
  <div v-else class="bg-white rounded-md border-[1px] border-liquidgrey">
    <table
      class="table-fixed text-black md:max-lg:block overflow-x-auto border-collapse w-full"
    >
      <thead class="border-b-[1px] border-b-liquidgrey">
        <tr class="text-liquiddark">
          <th class="w-[5%]"></th>
          <th class="w-[15%] hover:text-pink" @click="sortBy('name')">
            <button>Name</button>
          </th>
          <th
            v-if="selectedChainType !== 'near'"
            class="w-[10%] hover:text-pink"
            @click="sortBy('chain_id')"
          >
            <button>Chain ID</button>
          </th>
          <th class="w-[10%] hover:text-pink" @click="sortBy('currency')">
            <button>Currency</button>
          </th>
          <th v-if="selectedChainType === 'multiversx'" class="w-[10%]">
            Shards
          </th>
          <th class="w-[10%] hover:text-pink" @click="sortBy('chain_type')">
            <button>Type</button>
          </th>
          <th class="hover:text-pink">RPC URL</th>
          <th class="w-[10%] hover:text-pink" @click="sortBy('status')">
            <button>Enabled</button>
          </th>
          <th class="w-[5%]"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="chain in sortedList"
          :key="chain.id"
          class="hover:bg-liquid hover:text-pink"
        >
          <td>
            <img
              :src="
                getChainLogo(chain.chain_id, chain.compatibility, app.network)
              "
              alt="chain logo"
              class="w-8"
              @error="onChainLogoError"
            />
          </td>
          <td>
            <div class="space-x-1 flex items-center">
              <span>{{ chain.name }}</span>
              <span
                v-if="chain.default_chain"
                class="text-[#568DF0] text-[8px] bg-[#568DF0]/[0.1] rounded-[5px] p-[2px] px-[4px]"
                >Default</span
              >
              <span
                v-if="isGaslessSupport(chain.chain_id)"
                class="text-[#51C75F] text-[8px] bg-[#568DF0]/[0.1] rounded-[5px] p-[2px] px-[4px]"
                >Gasless</span
              >
            </div>
          </td>
          <td v-if="selectedChainType !== 'near'">{{ chain.chain_id }}</td>
          <td>{{ chain.currency }}</td>
          <td v-if="selectedChainType === 'multiversx'">
            {{ shardValue }}
          </td>
          <td>{{ chain.chain_type }}</td>
          <td class="text-ellipsis">{{ chain.rpc_url }}</td>
          <td>
            <VSwitch
              :value="chain.status"
              :disabled="chain.default_chain"
              @update:model-value="() => onChainToggle(chain)"
            />
          </td>
          <td class="last:text-right">
            <PopperJs placement="left-start" :arrow="true">
              <button
                class="flex justify-center items-center w-7 h-7 bg-[#262626] rounded-[5px]"
              >
                <img :src="MoreIcon" alt="more" />
              </button>
              <template #content>
                <ul
                  ref="showRowOptions_menu"
                  open
                  class="flex flex-col bg-liquidlight text-black rounded-md p-2 space-y-1 relative"
                >
                  <li
                    v-for="option in getRowOptions(
                      chain.default_chain,
                      chain.built_in,
                      rowOptions
                    )"
                    :key="option.value"
                    class="p-1 rounded-[5px] hover:text-pink text-left cursor-pointer"
                    @click.stop="onClickOfOption(option.value, chain.id, chain)"
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
