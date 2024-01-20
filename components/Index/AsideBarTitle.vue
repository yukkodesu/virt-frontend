<template>
    <button class="flex items-center gap-1.5 group mb-3 w-full focus-visible:outline-primary border-transparent"
        @click="onClick">
        <span class="text-sm/6 font-semibold truncate">{{ title }}</span>
        <span :class="[iconTrans]"
            class="i-heroicons-chevron-right-20-solid w-5 h-5 ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5 text-gray-700 dark:text-gray-200">
        </span>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string,
    open: boolean
}>();

const emit = defineEmits<{
    click: []
}>();

const isOpen = ref(props.open);
const onClick = () => {
    isOpen.value = !isOpen.value;
    emit('click');
};
const iconTrans = computed(() => {
    return isOpen.value ? "" : "rotate-90";
})

</script>