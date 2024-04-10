<template>
    <div>
        <NavBar />
        <div class="grid grid-cols-10 gap-8 mx-auto px-8 max-w-7xl">
            <div class="top-[64px] sticky h-min col-span-2 overflow-y-auto">
                <slot name="aside" />
            </div>
            <div class="h-[1000px] col-span-8">
                <h2
                    v-if="route.meta.title"
                    class="py-4 text-lg font-semibold text-gray-900"
                >
                    {{ route.meta.title }}
                </h2>
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
</script>
