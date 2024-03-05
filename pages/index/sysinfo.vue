<template>
    <div id="chart" class="py-8 px-4">
        <ClientOnly>
            <apexchart type="line" height="350" :options="chartOptions" :series="series"
                @updated="onChartUpdated">
            </apexchart>
        </ClientOnly>
    </div>
    <Teleport to="body">
        <Alert :alert-msg="alertOpt.msg" :show="alertOpt.show" icon="i-heroicons-x-circle-16-solid"
            :close="() => { alertOpt.show = false }">
        </Alert>
    </Teleport>
</template>

<script setup lang="ts">
const alertOpt = ref({
    msg: "",
    show: false,
})
const series = ref<Array<{
    name: string,
    data: Array<Array<{ x: number, y: number }>>
}>>([]);


const fetchData = async () => {
    try {
        const data = await fetch('/api/sysinfo');
        const sysinfo = await data.json();
        const seriesVal = series.value;
        const timestamp = Number(sysinfo['timestamp']);

        if (seriesVal.length === 0) {
            for (let i = 0; i < sysinfo['cpu number']; i++) {
                seriesVal.push({
                    name: `Core ${i}`,
                    data: []
                })
            }
        }
        const usage = JSON.parse(sysinfo['cpu usage']);
        Object.entries(usage).forEach(([k, v]: [string, any]) => {
            const i = Number(k);
            seriesVal[i].data.push({ x: timestamp, y: v });
        });
    }
    catch (e) {
        if (e instanceof Error) {
            alertOpt.value.msg = e.message;
            alertOpt.value.show = true;
        }
    }
}

fetchData();

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
    const seriesVal = series.value;
    if (seriesVal[0].data.length <= 15) return;
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