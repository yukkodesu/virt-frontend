<template>
    <div class="z-20 group w-48">
        <div
            class="relative focus:outline-none overflow-y-auto scroll-py-1 divide-y divide-gray-200 dark:divide-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 rounded-md shadow-lg bg-white dark:bg-gray-800"
        >
            <div class="p-1">
                <button
                    class="group flex items-center gap-1.5 w-full px-1.5 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark: hover:dark:bg-gray-900 hover:text-gray-900 hover:dark:text-white"
                >
                    <span
                        class="i-heroicons-check-circle-20-solid relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-5 w-5 text-[10px]"
                    />
                    <span class="truncate">{{ selected }} Selected</span>
                </button>
            </div>
            <div class="p-1">
                <div
                    v-for="item in items"
                    :key="item.label"
                >
                    <SnapshotContextMenuItem
                        :label="item.label"
                        :icon="item.icon"
                        :on-click="item.click"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    items: {
        label: string;
        icon: string;
        click?: (() => void) | (() => Promise<void>);
    }[];
    selected: string;
}>();
</script>
