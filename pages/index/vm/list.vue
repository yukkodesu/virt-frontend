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
        <AlertDialog v-model:is-open="isAlertOpen" :msg="alertMsg" :on-confirm="onAlertComfirm" />
    </div>
</template>

<script setup lang="ts">
import { useVirtStore } from '~/store/virt';
import { virtState } from '~/components/VM/utils';

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
    await $fetch('/api/v1/virt/set-state', {
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
                click: setDomState.bind(undefined, row.name, "suspend"),
            },
            {
                label: 'Destroy',
                icon: 'i-tabler-plug-x',
                click: () => {
                    openAlert("Do you want to cut power of your VM? This action could cause issue in VM.");
                    onAlertComfirm.value = async () => {
                        await setDomState(row.name, "destroy");
                        isAlertOpen.value = false;
                    };
                },
            },
            {
                label: 'Delete',
                icon: 'i-heroicons-trash-20-solid',
                click: () => {
                    openAlert("Do you want to delete your VM? This action will lose data in that VM.");
                    onAlertComfirm.value = async () => {
                        await setDomState(row.name, "undefine");
                        isAlertOpen.value = false;
                    };
                },
            },
        ],
];

//Alert Dialog
const isAlertOpen = ref(false);
const alertMsg = ref('');
const onAlertComfirm = ref<(() => Promise<void>) | null>(null);
const openAlert = (msg: string) => {
    alertMsg.value = msg;
    isAlertOpen.value = true;
};

</script>
