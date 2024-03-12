<template>
    <div id="chart" class="py-8 px-4">
        <ClientOnly>
            <apexchart type="line" height="350" :options="chartOptions" :series="series">
            </apexchart>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
type SysInfo = {
    "used swap": string;
    "cpu number": string;
    "cpu usage": string;
    timestamp: string;
    "used memory": string;
    "total memory": string;
    "total swap": string;
};
const props = defineProps<{
    sysinfo: SysInfo
}>();
const series = ref<Array<{
    name: string,
    data: Array<Array<{ x: number, y: number }>>
}>>([]);

for (let i = 0; i < Number(props.sysinfo['cpu number']); i++) {
    series.value.push({
        name: `Core ${i}`,
        data: []
    })
}

const updateGraph = (sysinfo: SysInfo) => {
    const seriesVal = series.value;
    const timestamp = Number(sysinfo['timestamp']);
    const usage = JSON.parse(sysinfo['cpu usage']);
    Object.entries(usage).forEach(([k, v]: [string, any]) => {
        const i = Number(k);
        seriesVal[i].data.push({ x: timestamp, y: v });
    });
    if (seriesVal[0]?.data?.length <= 15) return;
    seriesVal.forEach(it => it.data.shift());
}

updateGraph(props.sysinfo);

watch(props.sysinfo, (sysinfo) => {
    updateGraph(sysinfo);
})
const chartOptions = ref({
    chart: {
        type: 'line',
        height: 350,
        stacked: true,
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
        animations: {
            enabled: false,
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left'
    },
    xaxis: {
        type: 'datetime',
    },
    yaxis: {
        max: 100.0,
        min: 0.0,
        labels: {
            formatter: (val: number) => `${val.toFixed(0)}%`
        }
    },
});
</script>