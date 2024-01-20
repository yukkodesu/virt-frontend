<template>
    <div class="flex flex-col py-8 px-4">
        <div v-for="i in asideList">
            <IndexAsideBarTitle :title="i.title" :open="true" @click="onClick" />
            <IndexAsideBarItem :items="i.children" />
        </div>
    </div>
</template>

<script setup>
const asideList = [
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
]
</script>