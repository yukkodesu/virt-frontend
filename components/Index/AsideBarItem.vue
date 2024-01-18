<template>
    <div class="flex flex-col">
        <button class="flex items-center gap-1.5 group mb-3 w-full focus-visible:outline-primary border-transparent">
            <span class="text-sm/6 font-semibold truncate">Getting Started</span>
            <span
                class="i-heroicons-chevron-down-20-solid w-5 h-5 ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5 text-gray-700 dark:text-gray-200">
            </span>
        </button>
        <div>
            <div class="text-sm text-inherit dark:text-inherit p-0 mb-3 lg:mb-6">
                <nav class="space-y-3 border-l border-gray-200 dark:border-gray-800" style="margin-left: 0.5rem;">
                    <div class="space-y-1.5">
                        <a class="flex items-center gap-1.5 group border-l -ml-px pl-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400"
                            href="/getting-started">
                            <span class="text-sm/6 truncate">Introduction</span>
                        </a>
                        <a class="flex items-center gap-1.5 group border-l -ml-px pl-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400"
                            href="/getting-started/installation">
                            <span class="text-sm/6 truncate">Installation</span>
                        </a>
                        <a class="flex items-center gap-1.5 group border-l -ml-px pl-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400"
                            href="/getting-started/theming">
                            <span class="text-sm/6 truncate">Theming</span>
                        </a>
                        <a class="flex items-center gap-1.5 group border-l -ml-px pl-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400"
                            href="/getting-started/shortcuts">
                            <span class="text-sm/6 truncate">Shortcuts</span>
                        </a>
                        <a class="flex items-center gap-1.5 group border-l -ml-px pl-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400"
                            href="/getting-started/examples">
                            <span class="text-sm/6 truncate">Examples</span>
                        </a>
                        <a class="flex items-center gap-1.5 group border-l -ml-px pl-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400"
                            href="/getting-started/contributing">
                            <span class="text-sm/6 truncate">Contributing</span>
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    
}>();
</script>