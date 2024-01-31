<template>
    <div id="chart" class="py-8 px-4">
        <ClientOnly>
            <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
        </ClientOnly>
    </div>
    <Teleport to="body">
        <Alert :alert-msg="alertOpt.msg" :show="alertOpt.show" icon="i-heroicons-x-circle-16-solid"
            :close="() => { alertOpt.show = false }">
        </Alert>
    </Teleport>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import clone from 'lodash-es/cloneDeep';
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
        Object.entries(usage).forEach(([k, v]) => {
            if (seriesVal[k].data.length >= 20) {
                seriesVal[k].data.shift();
            }
            seriesVal[k].data.push({ x: timestamp, y: v });
        })
        if (seriesVal[0].data.length >= 20) {
            chartOptions.value = {
                xaxis: {
                    type: 'datetime',
                    min: seriesVal[0].data[0].x,
                    max: seriesVal[0].data[seriesVal[0].data.length - 1].x
                }
            };
        } else {
            chartOptions.value = {
                xaxis: {
                    type: 'datetime',
                    min: seriesVal[0].data[0].x,
                    max: dayjs(seriesVal[0].data[0].x).add(40, 'seconds').unix() * 1000,
                }
            };
        }
    }
    catch (e) {
        if (e instanceof Error) {
            alertOpt.value.msg = e.message;
            alertOpt.value.show = true;
        }
    }
}

fetchData();

let timer = null;

onMounted(() => {
    timer = setInterval(() => {
        fetchData();
    }, 2000);
})

onBeforeUnmount(() => {
    clearInterval(timer);
})
const chartOptions = ref({
    chart: {
        type: 'area',
        height: 350,
        stacked: true,
        events: {
            selection: function (chart, e) {
                console.log(new Date(e.xaxis.min))
            }
        },
    },
    colors: ['#008FFB', '#00E396', '#CED4DC'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left'
    },
    xaxis: {
        type: 'datetime',
        min: 0,
        max: 0,
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