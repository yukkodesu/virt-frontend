<template>
    <div class="flex flex-col gap-4">
        <UCard>
            <template #header>
                <div class="flex justify-between">
                    <h2 class="text-md font-semibold">{{ route.path.split('/').at(2) }}</h2>
                    <ul class="flex gap-2">
                        <li v-for="item in items" :key="item.label">
                            <UButton :icon="item.icon" variant="solid" @click="item.click">{{ item.label }}</UButton>
                        </li>
                    </ul>
                </div>
            </template>
            <template #default>
                <div class="flex items-center gap-12 px-6 py-0">
                    <div>
                        <img :src="`/distro_icons/512/512_debian.png`" alt="os icon" class="h-[60px] w-[60px]">
                    </div>
                    <div class="text-sm/6 text-gray-500 px-2">
                        <ul class="grid grid-cols-2 gap-x-[100px] gap-y-4">
                            <li>Name: {{ domain?.name }}</li>
                            <li>CPU Numbers: {{ domain?.vcpu }}</li>
                            <li>RAM Size: {{ formatBytes(Number(domain?.memory) * 1024) }}</li>
                            <li>State: {{ virtState[Number(domain?.state)] }}</li>
                        </ul>
                    </div>
                </div>
            </template>
        </UCard>
        <UCard>
            <template #header>
                <h2 class="text-md font-semibold">VNC Viewer</h2>
            </template>
            <template #default>
                <div class="flex justify-center relative">
                    <div class="h-[600px] w-full bg-slate-100">
                        <VMVncComponent :port="vnc_config?.port" :password="vnc_config?.password" :view-only="true" />
                    </div>
                    <button class="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <UIcon name="i-heroicons-play-20-solid" class="text-8xl text-white" />
                    </button>
                </div>
            </template>
        </UCard>
        <AlertDialog v-model:is-open="isAlertOpen" :msg="alertMsg" :on-confirm="onAlertComfirm" />
    </div>
</template>

<script setup lang="ts">
import { virtState, formatBytes } from '~/components/VM/utils';

const route = useRoute();
useHead({
    title: () => `${route.path.split('/').at(2)} - Virt Domains`,
});
definePageMeta({
    title: 'Virt Domains',
});

const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;

const dom_name = computed(() => `${route.path.split('/').at(2)}`);
const domain = computed(() => domains.find(it => it.name === dom_name.value));

const { data: vnc_config, refresh: refreshVncConfig } = useFetch<{ port: string; password: string; }>('/api/get-vnc-display-config', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(dom_name.value),
});

watch(() => dom_name.value, () => {
    refreshVncConfig();
})

const setDomState = async (dom_name: string | undefined, state: string) => {
    if (!dom_name) return;
    await $fetch('/api/alt-vm-state', {
        method: 'POST',
        body: {
            dom_name,
            state,
        }
    });
    await updateDomains();
}


const items =
    [
        {
            label: 'Start',
            icon: 'i-heroicons-play-20-solid',
            click: setDomState.bind(undefined, domain.value?.name, "start"),
        },
        {
            label: 'Shutdown',
            icon: 'i-heroicons-stop-20-solid',
            click: setDomState.bind(undefined, domain.value?.name, "shutdown"),
        },
        {
            label: 'Suspend',
            icon: 'i-heroicons-pause-20-solid',
            click: setDomState.bind(undefined, domain.value?.name, "suspend"),
        },
        {
            label: 'Destroy',
            icon: 'i-tabler-plug-x',
            click: () => {
                openAlert("Do you want to cut power of your VM? This action could cause issue in VM.");
                onAlertComfirm.value = async () => {
                    await setDomState(domain.value?.name, "destroy");
                    isAlertOpen.value = false;
                };
            },
        },
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
