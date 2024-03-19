<template>
    <div class="py-2 flex flex-col gap-2">
        <div class="flex gap-1">
            <div class="flex items-center">
                <span class="pr-2 text-sm">Select VM:</span>
                <div class="max-w-fit">
                    <USelectMenu v-model="selected" :options="options" />
                </div>
            </div>
        </div>
        <UCard :ui="{
                        body: {
                            padding: 'sm:p-0'
                        }
                    }">
            <UTable :rows="tableData" :columns="col" />
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { useVirtStore } from '~/store/virt';
const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
await callOnce(updateDomains);
const options = ref([]);
const selected = ref("Loading");
domains.map(it => options.value.push(it['name']));
selected.value = (options.value)[0];

const { data: snapshotData, refresh: refreshSnapshotData } = useAsyncData("snapshots", () => $fetch('/api/list-snapshot', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: [selected.value],
}));

const col = [
    {
        key: "name",
        label: "Name",
    },
    {
        key: "creationTime",
        label: "Creation Time",
    },
    {
        key: "state",
        label: "State"
    },
    {
        key: "description",
        label: "Description",
    },
    {
        key: "actions"
    }
]

refreshSnapshotData()

watch(selected, () => {
    refreshSnapshotData();
})

const tableData = computed(() => {
    if(!snapshotData.value) return [];
    return (snapshotData.value)[selected.value];
})

</script>