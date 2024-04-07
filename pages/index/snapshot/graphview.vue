<script setup lang="ts">
import type { Elements } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'

const el = ref(null);

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

const generatePositions = function (edges: Ref<{ [idx: string]: string[] }>, maxWidth: number, stepHeight: number): { [idx: string]: { x: number, y: number } } {
  const obj = edges.value;
  const positions: { [idx: string]: { x: number, y: number } } = {};
  const S = [];
  const queue: Array<{
    node: string,
    parent: string | null,
    level: number,
    position: { x: number, y: number }
  }> = [];
  const inBound = new Map<string, number>();
  Object.entries(obj).forEach(([_, v]) => {
    v.forEach((it) => {
      let prev = inBound.get(it);
      inBound.set(it, prev ? prev + 1 : 1);
    });
  });
  for (let k of Object.keys(obj)) {
    if (!inBound.get(k)) S.push(k);
  }
  S.forEach((it, idx, arr) => {
    const offset = arr.length > 1 ? maxWidth / (arr.length - 1) : 0;
    const x = idx * offset - ((arr.length - 1) * offset) / 2;
    queue.push({
      node: it,
      parent: null,
      level: 0,
      position: { x, y: 0 },
    });
  });
  while (queue.length > 0) {
    const u = queue.shift();
    if (!u) continue;
    const { node, parent, level, position } = u;
    const children = obj[node] || [];
    positions[node] = { ...position };

    if (parent) {
      const parentPosition = positions[parent];
      const siblingCount = obj[parent].length;
      const offset = siblingCount > 1 ? maxWidth / (siblingCount - 1) : 0;
      const siblingIndex = obj[parent].indexOf(node);
      const x =
        parentPosition.x +
        (siblingIndex * offset - ((siblingCount - 1) * offset) / 2);
      const y = parentPosition.y + stepHeight;
      positions[node].x = x;
      positions[node].y = y;
    }

    for (const child of children) {
      queue.push({ node: child, parent: node, level: level + 1, position: { x: 0, y: 0 } });
    }
  }

  return positions;
}


refreshSnapshotTree().then(() => {

});

watch(selected, async () => {
  await refreshSnapshotTree();
  const pos = generatePositions(snapshotTree, 300, 100);
  console.log(pos);
  for (let edge in snapshotTree.value) {
    elements.value.push({ id: edge, label: edge, position: { x: pos[edge].x + 200, y: pos[edge].y } });
    (snapshotTree.value)[edge].forEach(it => {
      elements.value.push({ id: `e${edge}-${it}`, source: `${edge}`, target: `${it}` });
    })
  }
  console.log(elements.value);
})

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
  <div ref="el" class="w-full h-screen">
    <VueFlow v-model="elements">
    </VueFlow>
  </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>