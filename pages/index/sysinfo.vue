<template>
    <div class="py-2">
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
const showAlert = inject<(msg: string) => void>('showAlert');

const { data: sysinfo, error: fetchError, refresh } = await useFetch<{
    "used swap": string,
    "cpu number": string,
    "cpu usage": string,
    timestamp: string,
    "used memory": string,
    "total memory": string,
    "total swap": string,
}>('/api/sysinfo', { timeout: 5000 });

refresh();

let timer: any = null;
onMounted(() => {
    timer = setInterval(() => {
        refresh();
    }, 2000);
})
onBeforeUnmount(() => {
    clearInterval(timer);
})
</script>