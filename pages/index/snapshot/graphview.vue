<script setup lang="ts">
import type { Elements, MouseTouchEvent, NodeMouseEvent } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import { useMouse, useWindowScroll, useElementSize } from '@vueuse/core';

const el = ref(null);

const { width } = useElementSize(el);

const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
await callOnce(updateDomains);

const options = ref([]);
const selected = ref("Loading");
domains.map(it => options.value.push(it['name']));
selected.value = (options.value)[0];

const { data: snapshotTree, refresh: refreshSnapshotTree } = useAsyncData<{
  [idx: string]: string[]
}>("snapshotTree", () => $fetch('/api/list-snapshot-tree', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(selected.value),
}));

const { data: snapshotData, refresh: refreshSnapshotData } = useAsyncData<{
  [idx: string]: {
    isCurrent: string,
    state: string,
    creationTime: string,
    name: string,
    description: string,
  }[]
}>("snapshotData", () => $fetch('/api/list-snapshot', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: [selected.value],
}));

const elements = ref<Elements>([]);

const generatePositions = function (edges: Ref<{ [idx: string]: string[] } | null>, maxWidth: number, stepHeight: number): { [idx: string]: { x: number, y: number } } | null {
  const obj = edges.value;
  if (!obj) return null;
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

const updateRender = async () => {
  elements.value.splice(0);
  if (!snapshotData.value || !snapshotTree.value) return;
  if ((snapshotData.value)[selected.value]) {
    const [curSnapshot] = (snapshotData.value)[selected.value].filter(it => it.isCurrent === 'true');
    if (curSnapshot) {
      (snapshotTree.value)[curSnapshot.name].push("Current");
      (snapshotTree.value)["Current"] = [];
    }
  }
  const pos = generatePositions(snapshotTree, 250, 100);
  if (!pos) return;
  for (let edge in snapshotTree.value) {
    elements.value.push({
      id: edge,
      label: edge,
      position: { x: pos[edge].x + (width.value / 3), y: pos[edge].y },
      class: "snapshot-node",
      style: edge === "Current" ? {
        "color": "rgb(var(--color-primary-DEFAULT))",
        "border-color": "rgb(var(--color-primary-DEFAULT))",
      } : {},
    });
    (snapshotTree.value)[edge].forEach(it => {
      elements.value.push({ id: `e${edge}-${it}`, source: `${edge}`, target: `${it}` });
    });
  }
}

Promise.all([refreshSnapshotData(), refreshSnapshotTree()]).then(() => {
  updateRender();
});

watch(selected, async () => {
  await Promise.all([refreshSnapshotData(), refreshSnapshotTree()]);
  updateRender();
})



//Context Menu Code Below

const rightClickSelect = ref("None");
const { x, y } = useMouse();
const { y: windowY } = useWindowScroll();
const selectedNode = ref<string | null>(null);
const snapshotInfo = computed(() => {
  if (!snapshotData.value || !selectedNode.value) return null;
  return (snapshotData.value)[selected.value].find(it => it.name === selectedNode.value);
})

const isOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect() { } });

const onNodeClick = (e: NodeMouseEvent) => {
  selectedNode.value = e.node.id;
}

function onContextMenu(e: MouseEvent) {
  if (e.target instanceof Element) {
    const el: HTMLElement | null = e.target.closest(".snapshot-node");
    if (!el) return;
    rightClickSelect.value = `${el.dataset.id}`;
    selectedNode.value = `${el.dataset.id}`;
  }
  const top = unref(y) - unref(windowY)
  const left = unref(x)

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left
  })

  isOpen.value = true
}

const items = [
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
      console.log('Edit')
    }
  },
  {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
  }
]

</script>

<template>
  <div class="relative">
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
    <div ref="el" @contextmenu.prevent="onContextMenu">
      <div class="w-full h-screen">
        <VueFlow v-model="elements" @node-click="onNodeClick">
        </VueFlow>
      </div>
      <UContextMenu v-model="isOpen" :virtual-element="virtualElement">
        <SnapshotContextMenu :items="items" :selected="rightClickSelect" />
      </UContextMenu>
    </div>
    <div class="py-2 absolute right-0 top-0 w-[300px]">
      <SnapshotInfoWidget :snapshot-info="snapshotInfo" />
    </div>
  </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>