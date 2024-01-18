<template>
    <header
        class="h-[64px] bg-background/75 backdrop-blur -mb-px sticky top-0 z-50 flex items-center justify-between px-20 font-sans text-gray-800">
        <div class="flex items-center h-full">
            <h1 class="text-xl">VirtManager</h1>
        </div>
        <div>
            <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
                <UButton color="white" :label="user.username" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
const authStore = useAuthStore();
const { user, initUserInfo } = authStore;
onMounted(()=>{
    initUserInfo();
})
const items = [
    [
        {
            label: 'Edit Profile',
            icon: 'i-heroicons-pencil-square-20-solid',
        }
    ],
    [
        {
            label: 'Log Out',
            icon: 'i-heroicons-power',
            click: () => {
                console.log('Edit')
            }
        }
    ]
];
</script>