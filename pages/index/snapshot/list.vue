<template>
    <div>
        <div class="flex flex-col gap-2">
            <div class="flex gap-4">
                <div class="flex items-center">
                    <span class="pr-2 text-sm">Select VM:</span>
                    <div class="max-w-fit">
                        <USelectMenu
                            v-model="selected"
                            :options="options"
                        />
                    </div>
                </div>
                <div>
                    <UInput
                        v-model="searchInput"
                        icon="i-heroicons-magnifying-glass-20-solid"
                        size="sm"
                        color="white"
                        :trailing="false"
                        placeholder="Search..."
                    />
                </div>
                <div>
                    <UButton 
                        icon="i-heroicons-plus-16-solid"
                        @click="onCreateBtnClick"
                    >
                        Create
                    </UButton>
                </div>
                <div>
                    <UButton 
                        icon="i-heroicons-clock-16-solid"
                        @click="onSchedBtnClick"
                    >
                        Auto Snapshot
                    </UButton>
                </div>
            </div>
            <UCard
                :ui="{
                    body: {
                        padding: 'sm:p-0',
                    },
                }"
            >
                <UTable
                    :rows="tableData"
                    :columns="col"
                    :loading="isTableLoading"
                    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
                    :progress="{ color: 'primary', animation: 'carousel' }"
                >
                    <template #name-data="{ row }">
                        <span :class="[row['isCurrent'] && 'text-primary-500 dark:text-primary-400']">
                            {{ row['isCurrent'] ? `${row.name} (Current)` : row.name }}
                        </span>
                    </template>
                    <template #actions-data="{ row }">
                        <UDropdown :items="items(row)">
                            <UButton
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-ellipsis-horizontal-20-solid"
                            />
                        </UDropdown>
                    </template>
                </UTable>
            </UCard>
        </div>
        <SnapshotEditor
            v-model:is-open="isEditorOpen"
            v-model:snapshot-info="modalSnapshotInfo"
            :on-confirm="onEditorComfirm"
            :is-create="isCreateSnapshot"
            :snapshot-list="snapshotData ? snapshotData[selected] : null"
        />
        <AlertDialog
            v-model:is-open="isAlertOpen"
            :msg="alertMsg"
            :on-confirm="onAlertComfirm"
        />
        <SnapshotScheduledJobModal v-model:is-open="isSchedModalOpen" :domain="selected" />
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useVirtStore } from '~/store/virt';

dayjs.extend(localizedFormat);

definePageMeta({
    title: 'Snapshot List',
});

const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
await callOnce(updateDomains);
const options = ref<string[]>([]);
const selected = ref('Loading');
const isTableLoading = ref(true);
domains.map(it => options.value.push(it['name']));
selected.value = (options.value)[0];

const { data: snapshotData, refresh: refreshSnapshotData } = useAsyncData<{
    [idx: string]: {
        isCurrent: string;
        state: string;
        creationTime: string;
        name: string;
        description: string;
    }[];
}>('snapshotData', () => $fetch('/api/v1/snapshot/list', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: [selected.value],
}));

const col = [
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'creationTime',
        label: 'Creation Time',
    },
    {
        key: 'state',
        label: 'State',
    },
    {
        key: 'description',
        label: 'Description',
    },
    {
        key: 'actions',
        label: 'Action',
    },
];

const isEditorOpen = ref(false);
const modalSnapshotInfo = ref<{ name: string; description: string; parent?: string; }>({
    name: '',
    description: '',
});
const onEditorComfirm = ref<(() => Promise<void>) | null>(null);

const isAlertOpen = ref(false);
const alertMsg = ref('');
const onAlertComfirm = ref<(() => Promise<void>) | null>(null);
const openAlert = (msg: string) => {
    alertMsg.value = msg;
    isAlertOpen.value = true;
};

const items = (row: { name: string, description: string }) => [
    [
        {
            label: 'Edit Description',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => {
                isEditorOpen.value = true;
                modalSnapshotInfo.value = {
                    name: row['name'],
                    description: row['description'] === 'None' ? '' : row['description'],
                };
                onEditorComfirm.value = async () => {
                    isTableLoading.value = true;
                    await $fetch('/api/v1/snapshot/edit', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: {
                            dom_name: selected.value,
                            snapshot_name: row['name'],
                            description: modalSnapshotInfo.value.description,
                        },
                    });
                    await refreshSnapshotData();
                    isTableLoading.value = false;
                };
            },
        },
        {
            label: 'Set Current',
            icon: 'i-heroicons-check-circle-20-solid',
            click: () => {
                openAlert('Revert to another snapshot will discard all your changes in VM now, Do you still continue ?');
                onAlertComfirm.value = async () => {
                    isAlertOpen.value = false;
                    isTableLoading.value = true;
                    await $fetch('/api/v1/snapshot/set-current', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
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
            label: 'Clone Into VM',
            icon: 'i-heroicons-document-duplicate-20-solid',
            click: () => {
                openAlert('Clone this snapshot into new VM, Do you still continue ?');
                onAlertComfirm.value = async () => {
                    isAlertOpen.value = false;
                    isTableLoading.value = true;
                    await $fetch('/api/v1/snapshot/clone-as-vm', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
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
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid',
            click: () => {
                openAlert('Delete snapshot will lose data on this snapshot. Do you still continue ?');
                onAlertComfirm.value = async () => {
                    isAlertOpen.value = false;
                    isTableLoading.value = true;
                    await $fetch('/api/v1/snapshot/delete', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
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
    ],
];

refreshSnapshotData().then(() => {
    isTableLoading.value = false;
});

watch(selected, async () => {
    isTableLoading.value = true;
    await refreshSnapshotData();
    isTableLoading.value = false;
});

const searchInput = ref('');

const tableData = computed(() => {
    if (!snapshotData.value) return [];
    const data = (snapshotData.value)[selected.value]?.map((it) => {
        return {
            ...it,
            isCurrent: it['isCurrent'].toLowerCase() === 'true' ? true : false,
            creationTime: dayjs(Number(it['creationTime']) * 1000).format('llll'),
            description: it['description'] === '' ? 'None' : it['description'],
        };
    });
    if (searchInput.value !== '') {
        return data?.filter((it) => {
            for (const val of Object.values(it)) {
                if (`${val}`.toLowerCase().includes(searchInput.value)) {
                    return true;
                }
            }
            return false;
        });
    }
    return data;
});

// Code for snapshot create 

const isCreateSnapshot = ref(false);
const onCreateBtnClick = () => {
    modalSnapshotInfo.value = {
        name: '',
        description: '',
        parent: ''
    };
    isEditorOpen.value = true;
    isCreateSnapshot.value = true;
    onEditorComfirm.value = async () => {
        isTableLoading.value = true;
        await $fetch('/api/v1/snapshot/create', {
            method: 'POST',
            headers: {
                        'Content-Type': 'application/json',
            },
            body: { 
                dom_name: selected.value,
                snapshot_name: modalSnapshotInfo.value.name,
                description: modalSnapshotInfo.value.description,
                parent: modalSnapshotInfo.value.parent,
            }
        });
        await refreshSnapshotData();
        isTableLoading.value = false;
    }
}

// Code for auto snapshot

const isSchedModalOpen = ref(false);

const onSchedBtnClick = () => {
    isSchedModalOpen.value = true;
}

</script>
