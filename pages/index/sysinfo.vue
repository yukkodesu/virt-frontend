<template>
    <div>
        <UCard>
            <SysInfoCpuUsageGraph :sysinfo="sysinfo" />
        </UCard>
    </div>
</template>

<script setup lang="ts">
const showAlert = inject<(msg: string) => void>('showAlert');
const sysinfo = ref({
    "used swap": "",
    "cpu number": "",
    "cpu usage": "",
    timestamp: "",
    "used memory": "",
    "total memory": "",
    "total swap": "",
});

const { data, error: fetchError, refresh } = await useFetch('/api/sysinfo', { timeout: 5000 });

const updateSysInfo = () => {
    if (fetchError.value) {
        showAlert && showAlert(fetchError.value?.message);
        return;
    }
    Object.entries(data.value).forEach(([k, v]: [string, any]) => {
        (sysinfo.value)[k] = `${v}`;
    })
}

updateSysInfo();


let timer: any = null;
onMounted(() => {
    timer = setInterval(() => {
        refresh();
        console.log(fetchError.value);
        updateSysInfo();
    }, 2000);
})
onBeforeUnmount(() => {
    clearInterval(timer);
})
</script>