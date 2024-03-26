<template>
    <div class="py-2 flex flex-col gap-2">
        <div class="flex gap-4">
            <div class="flex items-center">
                <span class="pr-2 text-sm">Select VM:</span>
                <div class="max-w-fit">
                    <USelectMenu v-model="selected" :options="options" />
                </div>
            </div>
            <div>
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                    v-model="searchInput" placeholder="Search..." />
            </div>
        </div>
        <UCard :ui="{
                        body: {
                            padding: 'sm:p-0'
                        }
                    }">
            <UTable :rows="tableData" :columns="col" :loading="isTableLoading"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
                :progress="{ color: 'primary', animation: 'carousel' }">
                <template #name-data="{ row }">
                    <span :class="[row['isCurrent'] && 'text-primary-500 dark:text-primary-400']">
                        {{ row['isCurrent'] ? `${row.name} (Current)` : row.name }}
                    </span>
                </template>
                <template #actions-data="{ row }">
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>
            </UTable>
        </UCard>
    </div>
    <SnapshotEditor v-model:is-open="isEditorOpen" v-model:snapshot-info="modelSnapshotInfo"
        :onConfirm="onEditorComfirm" />
    <SnapshotAlertDialog v-model:is-open="isAlertOpen" :msg="alertMsg" :onConfirm="onAlertComfirm" />
</template>

<script setup lang="ts">
import { useVirtStore } from '~/store/virt';
import dayjs from 'dayjs';
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);


const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
await callOnce(updateDomains);
const options = ref([]);
const selected = ref("Loading");
const isTableLoading = ref(true);
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
        key: "actions",
        label: "Action"
    }
];

const isEditorOpen = ref(false);
const modelSnapshotInfo = ref<{ name: string, description: string }>({
    name: "",
    description: "",
});
const onEditorComfirm = ref<(() => Promise<void>) | null>(null);

const isAlertOpen = ref(false);
const alertMsg = ref("");
const onAlertComfirm = ref<(() => Promise<void>) | null>(null);
const openAlert = (msg: string) => {
    alertMsg.value = msg;
    isAlertOpen.value = true;
};

const items = (row) => [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => {
                isEditorOpen.value = true;
                modelSnapshotInfo.value = {
                    name: row['name'],
                    description: row['description'] === "None" ? "" : row['description']
                }
                onEditorComfirm.value = async () => {
                    isAlertOpen.value = false;
                    isTableLoading.value = true;
                    await $fetch('/api/snapshot-edit', {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: modelSnapshotInfo.value,
                    });
                    await refreshSnapshotData();
                    isTableLoading.value = false;
                }
            },
        },
        {
            label: 'Set Current',
            icon: 'i-heroicons-check-circle-20-solid',
            click: () => {
                openAlert("Revert to another snapshot will discard all your changes in VM now, Do you still continue ?");
                onAlertComfirm.value = async () => {
                    isAlertOpen.value = false;
                    isTableLoading.value = true;
                    await $fetch('/api/set-current-snapshot', {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: {
                            dom_name: selected.value,
                            snapshot_name: row['name'],
                        },
                    });
                    await refreshSnapshotData();
                    isTableLoading.value = false;
                };
            },
        },
        {
            label: 'Clone',
            icon: 'i-heroicons-document-duplicate-20-solid'
        },
        {
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid'
        }
    ]
]

refreshSnapshotData().then(() => {
    isTableLoading.value = false;
});

watch(selected, async () => {
    isTableLoading.value = true;
    await refreshSnapshotData();
    isTableLoading.value = false;
})

const searchInput = ref("");

const tableData = computed(() => {
    if (!snapshotData.value) return [];
    const data = (snapshotData.value)[selected.value]?.map(it => {
        return {
            ...it,
            isCurrent: it['isCurrent'].toLowerCase() === 'true' ? true : false,
            creationTime: dayjs(Number(it['creationTime']) * 1000).format('llll'),
            description: it['description'] === "" ? "None" : it['description'],
        };
    });
    if (searchInput.value !== "") {
        return data?.filter(it => {
            for (let val of Object.values(it)) {
                if (`${val}`.toLowerCase().includes(searchInput.value)) {
                    return true;
                }
            }
            return false;
        });
    }
    return data;
});

</script>