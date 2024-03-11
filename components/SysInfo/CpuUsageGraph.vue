<template>
    <div id="chart" class="py-8 px-4">
        <ClientOnly>
            <apexchart type="line" height="350" :options="chartOptions" :series="series" @updated="onChartUpdated">
            </apexchart>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
const series = ref<Array<{
    name: string,
    data: Array<Array<{ x: number, y: number }>>
}>>([]);

const showAlert = inject<(msg: string) => void>('showAlert');

const { data, error: fetchError, refresh } = await useFetch('/api/sysinfo');
if (fetchError.value) {
    showAlert && showAlert(fetchError.value?.message);
}

const fetchData = async () => {
    await refresh();
    if (fetchError.value) {
        showAlert && showAlert(fetchError.value?.message);
    }
    const sysinfo = data.value;
    const seriesVal = series.value;
    if (seriesVal.length === 0) {
        for (let i = 0; i < sysinfo['cpu number']; i++) {
            seriesVal.push({
                name: `Core ${i}`,
                data: []
            })
        }
    }
    const timestamp = Number(sysinfo['timestamp']);
    const usage = JSON.parse(sysinfo['cpu usage']);
    Object.entries(usage).forEach(([k, v]: [string, any]) => {
        const i = Number(k);
        seriesVal[i].data.push({ x: timestamp, y: v });
    });
}

let timer: any = null;

onMounted(() => {
    timer = setInterval(() => {
        fetchData();
    }, 2000);
})

onBeforeUnmount(() => {
    clearInterval(timer);
})

const onChartUpdated = () => {
    const sysinfo = data.value;
    const seriesVal = series.value;
    if (seriesVal[0]?.data?.length <= 15) return;
    seriesVal.forEach(it => it.data.shift());
}

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
        max: 600.0,
        min: 0.0,
        labels: {
            formatter: (val: number) => `${val.toFixed(0)}%`
        }
    },
});
</script>