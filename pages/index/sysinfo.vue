<template>
    <div>
        <div class="flex gap-2 pb-2">
            <UCard>
                <SysInfoRamUsageGraph :sysinfo="sysinfo" />
            </UCard>
            <UCard>
                <SysInfoSwapUsageGraph :sysinfo="sysinfo" />
            </UCard>
        </div>
        <UCard>
            <SysInfoCpuUsageGraph :sysinfo="sysinfo" />
        </UCard>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'System Utilization',
});

// const showAlert = inject<(msg: string) => void>('showAlert');

const { data: sysinfo, refresh } = await useFetch<{
    'used swap': string;
    'cpu number': string;
    'cpu usage': string;
    'timestamp': string;
    'used memory': string;
    'total memory': string;
    'total swap': string;
}>('/api/v1/sys/utilization/get', { timeout: 5000 });

refresh();

let timer: number | null = null;
onMounted(() => {
    timer = setInterval(() => {
        refresh();
    }, 2000);
});
onBeforeUnmount(() => {
    clearInterval(timer);
});
</script>
