<template>
    <div class="flex flex-col gap-2">
        <div class="flex gap-4">
            <div>
                <UInput
                    v-model="searchInput" 
                    icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white"
                    :trailing="false" placeholder="Search..." />
            </div>
        </div>
        <UCard
        :ui="{
            body: {
                padding: 'sm:p-0',
            },
        }">
            <UTable
                :rows="tableData" :columns="col" :loading="isTableLoading"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
                :progress="{ color: 'primary', animation: 'carousel' }">
                <template #os-data="{ row }">
                    <div class="w-6 h-6">
                        <img :src="`/distro_icons/128/128_${row.os}.png`" :alt="`${row.os} icon`">
                    </div>
                </template>
                <template #actions-data="{ row }">
                    <UDropdown :items="items(row)" dynamic>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>
            </UTable>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { useVirtStore } from '~/store/virt';

definePageMeta({
    title: 'Virt Domains',
});
useHead({
    title: 'Virt Domains',
});

const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
const searchInput = ref('');

const isTableLoading = ref(true);

await callOnce(updateDomains).then(() => isTableLoading.value = false);

const virtState = [
    'No State',
    'Running',
    'Blocked',
    'Paused',
    'Shutdown',
    'Shutoff',
    'Crashed',
    'PM Suspended',
];

const tableData = computed(() => {
    return domains.map((it) => {
        return {
            ...it,
            state: virtState[Number(it.state)],
            os: it.name.includes('win') ? 'windows' : 'debian',
        };
    });
});

const col = [
    {
        key: 'os',
        label: ' OS',
    },
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'state',
        label: 'State',
    },
    {
        key: 'actions',
        label: 'Action',
    },
];

let timer: number | null = null;
onMounted(() => {
    timer = setInterval(() => {
        updateDomains();
    }, 4000);
});
onBeforeUnmount(() => {
    clearInterval(timer);
});

const setDomState = async (dom_name: string, state: string) => {
    isTableLoading.value = true;
    await $fetch('/api/alt-vm-state', {
        method: 'POST',
        body: {
            dom_name,
            state,
        }
    });
    await updateDomains();
    isTableLoading.value = false;
}

const items = (row: {
    os: string;
    name: string;
    state: string;
}) => [
        [
            {
                label: 'Start',
                icon: 'i-heroicons-play-20-solid',
                click: setDomState.bind(undefined, row.name, "start"),
            },
            {
                label: 'Shutdown',
                icon: 'i-heroicons-stop-20-solid',
                click: setDomState.bind(undefined, row.name, "shutdown"),
            },
            {
                label: 'Suspend',
                icon: 'i-heroicons-pause-20-solid',
                click: setDomState.bind(undefined, row.name, "Suspend"),
            },
            {
                label: 'Destroy',
                icon: 'i-tabler-plug-x',
                click: setDomState.bind(undefined, row.name, "destroy"),
            },
            {
                label: 'Delete',
                icon: 'i-heroicons-trash-20-solid',
                click: setDomState.bind(undefined, row.name, "undefine"),
            },
        ],
    ];
</script>
