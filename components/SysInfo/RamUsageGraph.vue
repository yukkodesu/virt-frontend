<template>
    <ClientOnly>
        <apexchart
            type="radialBar"
            height="200"
            :options="chartOptions"
            :series="series"
        />
    </ClientOnly>
</template>

<script setup lang="ts">
type SysInfo = {
    'used swap': string;
    'cpu number': string;
    'cpu usage': string;
    'timestamp': string;
    'used memory': string;
    'total memory': string;
    'total swap': string;
};

const props = defineProps<{
    sysinfo: SysInfo;
}>();

const getMemUsagePercentage = (sysinfo: SysInfo) => (Number(sysinfo['used memory']) * 100 / Number(sysinfo['total memory'])).toFixed(2);

const series = ref([getMemUsagePercentage(props.sysinfo)]);

watch(() => props.sysinfo, (sysinfo) => {
    series.value.shift();
    series.value.push(getMemUsagePercentage(sysinfo));
});

const chartOptions = ref({
    chart: {
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: '70%',
            },
        },
    },
    labels: ['Mem'],
});
</script>
