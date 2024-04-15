<template>
    <UCard>
        <template #header>
            <div class="flex justify-between">
                <h2 class="text-md font-semibold">{{ route.path.split('/').at(2) }}</h2>
                
            </div>
        </template>
        <template #default>
            <div class="flex gap-[100px] items-center">
                <div>
                    <img :src="`/distro_icons/512/512_debian.png`" alt="os icon" class="h-[80px] w-[80px]">
                </div>
                <div class="text-sm/6 text-gray-500">
                    <ul class="grid grid-cols-2 gap-x-[100px] gap-y-4">
                        <li>Name: debian</li>
                        <li>CPU Numbers: 4</li>
                        <li>Memory Size: 8GB</li>
                        <li>State: shutoff</li>
                    </ul>
                </div>
            </div>
        </template>
    </UCard>
</template>

<script setup lang="ts">
const route = useRoute();

useHead({
    title: () => `${route.path.split('/').at(2)} - Virt Domains`,
});
definePageMeta({
    title: 'Virt Domains',
});
</script>
