<template>
    <div class="flex flex-col py-8 px-4">
        <div
            v-for="(i, idx) in asideList"
            :key="i.title"
        >
            <IndexAsideBarTitle
                :title="i.title"
                :open="true"
                @click="onClick(idx)"
            />
            <Transition>
                <IndexAsideBarItem
                    v-show="isOpen[idx]"
                    :items="i.children"
                />
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { useVirtStore } from '~/store/virt';

const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
const asideList = ref([
    {
        title: 'Host Infomation',
        children: [
            {
                title: 'System Utilization',
                navTo: '/sysinfo',
            },
            {
                title: 'User Profile',
                navTo: '/userprofile',
            },
        ],
    },
    {
        title: 'Virtual Machine',
        children: [
            {
                title: 'Virt List',
                navTo: '/vm/list',
            },
        ],
    },
    {
        title: 'SnapShots',
        children: [
            {
                title: 'Snapshot List',
                navTo: '/snapshot/list',
            },
            {
                title: 'GraphView Manager',
                navTo: '/snapshot/graphview',
            },
        ],
    },
]);

await callOnce(updateDomains);
domains?.forEach((it) => {
    asideList.value[1].children.push({
        title: it['name'],
        navTo: `/vm/${it['name']}`,
    });
});
const isOpen = ref(Array(asideList.value.length).fill(true));

const onClick = (idx) => {
    const arr = isOpen.value;
    arr[idx] = !arr[idx];
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: height 3s ease-in;
    overflow: hidden;
}

.v-enter-from,
.v-leave-to {
    height: 0;
}
</style>
