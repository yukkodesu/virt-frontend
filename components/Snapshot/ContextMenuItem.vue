<template>
    <button @click="onClick"
        class="group flex items-center gap-1.5 w-full px-1.5 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark: hover:dark:bg-gray-900 hover:text-gray-900 hover:dark:text-white">
        <span class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500" :class="icon"></span>
        <span class="truncate">{{ label }}</span>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string,
    icon: string,
    onClick: (() => Promise<void>) | (() => void) | undefined,
}>();
</script>