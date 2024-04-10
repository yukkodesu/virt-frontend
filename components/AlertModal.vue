<template>
    <Transition>
        <div
            v-if="show"
            class="w-[400px] absolute left-1/2 top-12 transform -translate-x-1/2 translate-y-1/2 z-10"
        >
            <UAlert
                :title="alertMsg"
                color="red"
                :icon="icon"
                :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
                @close="close"
            />
        </div>
    </Transition>
</template>

<script setup lang="ts">
defineProps<{
    show: boolean;
    alertMsg: string;
    icon: string;
    close: () => void;
}>();
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translate(-50%, 0);
}

.v-enter-to,
.v-leave-from {
    opacity: 100;
    transform: translate(-50%, 50%);
}
</style>
