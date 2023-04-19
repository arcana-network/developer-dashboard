<script setup lang="ts">
import ChainIcon from '@/assets/iconography/github.svg'
import MoreIcon from '@/assets/iconography/more.svg'
</script>

<template>
  <div class="table-container | rounded-md">
    <table class="table-fixed text-white">
      <thead>
        <tr>
          <th class="chain-icon"></th>
          <th class="chain-name">Name</th>
          <th class="chain-data">Network</th>
          <th class="chain-data">ID</th>
          <th class="chain-data">Symbol</th>
          <th class="chain-data">Compatibility</th>
          <th class="chain-data">Type</th>
          <th>RPC URL</th>
          <th>Enabled</th>
          <th class="chain-more"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <img :src="ChainIcon" alt="chain icon" class="w-6 h-6" />
          </td>
          <td class="text-ellipsis">Polygon Mainnet</td>
          <td class="text-ellipsis">Polygon POS</td>
          <td>137</td>
          <td>MATIC</td>
          <td>EVM</td>
          <td>Mainnet</td>
          <td class="text-ellipsis">https://polygon-rpc.com</td>
          <td><input type="checkbox" /></td>
          <td><img :src="MoreIcon" alt="more" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  border: 1px solid #363636;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
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

.chain-icon {
  width: 5%;
}

.chain-more {
  width: 5%;
}

.chain-name {
  width: 15%;
}
</style>
