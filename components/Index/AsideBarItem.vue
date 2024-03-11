<template>
    <div class="text-sm text-inherit dark:text-inherit p-0 mb-3 lg:mb-6">
        <nav class="space-y-3 border-l border-gray-200 dark:border-gray-800" style="margin-left: 0.5rem;">
            <div class="space-y-1.5">
                <a v-for="item in items"
                    class="flex items-center gap-1.5 group border-l -ml-px pl-4 text-gray-500 dark:text-gray-400"
                    :class="isActive(route.path, item.navTo) ? 'text-primary border-current' : 'border-transparent hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-500 dark:hover:border-gray-400'"
                    :href="item.navTo">
                    <span class="text-sm/6 truncate">{{
                        item.title }}</span>
                </a>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const isActive = (path: string, navTo: string) => {
    return path === `${navTo}`;
}
const props = defineProps<{
    items: Array<{
        title: string,
        navTo: string,
    }>,
}>();
</script>