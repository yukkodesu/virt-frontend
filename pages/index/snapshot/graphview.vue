<script setup lang="ts">
import type { Elements } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
await callOnce(updateDomains);
const options = ref([]);
const selected = ref("Loading");
domains.map(it => options.value.push(it['name']));
selected.value = (options.value)[0];

const { data: snapshotTree, refresh: refreshSnapshotTree } = useAsyncData("snapshots", () => $fetch('/api/list-snapshot-tree', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(selected.value),
}));
const elements = ref<Elements>([]);

refreshSnapshotTree().then(() => {
  console.log(snapshotTree.value);
});

</script>

<template>
  <div class="py-2 flex flex-col gap-2">
    <div class="flex gap-4">
      <div class="flex items-center">
        <span class="pr-2 text-sm">Select VM:</span>
        <div class="max-w-fit">
          <USelectMenu v-model="selected" :options="options" />
        </div>
      </div>
    </div>
  </div>
  <VueFlow v-model="elements">
  </VueFlow>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>