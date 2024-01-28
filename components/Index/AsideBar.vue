<template>
    <div class="flex flex-col py-8 px-4">
        <div v-for="(i, idx) in asideList">
            <IndexAsideBarTitle :title="i.title" :open="true" @click="onClick(idx)" />
            <Transition>
                <IndexAsideBarItem :items="i.children" v-show="isOpen[idx]" />
            </Transition>
        </div>
    </div>
</template>

<script setup>
const asideList = ref([
    {
        title: "Host Infomation",
        children: [
            {
                title: "System Utilization",
                navTo: "sysinfo",
            },
            {
                title: "User Profile",
                navTo: "userprofile",
            },
        ]
    },
    {
        title: "Virtual Machine",
        children: [
            {
                title: "debian",
                navTo: "vm/debian",
            },
            {
                title: "win10",
                navTo: "vm/win10",
            },
        ]
    }
]);
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