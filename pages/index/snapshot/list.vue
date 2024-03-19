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
            <UTable :rows="tableData" />
        </UCard>
    </div>
    {{ snapshotData }}
</template>

<script setup lang="ts">
import { useVirtStore } from '~/store/virt';
const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
await callOnce(updateDomains);
const options = ref([]);
const selected = ref("Loading");
domains.map(it => options.value.push(it['name']));
selected.value = (options.value)[1];

const { data: snapshotData, refresh } = useFetch("/api/list-snapshot", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify([selected.value]),
});

const tableData = computed(() => {
    return (snapshotData.value)[selected.value];
})

</script>