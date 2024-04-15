<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen');
const props = defineProps<{
    msg: string;
    onConfirm: (() => Promise<void>) | null;
}>();
</script>

<template>
    <div>
        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '' }">
                <template #header>
                    <h2>Warning</h2>
                </template>
                <template #default>
                    <div class="flex gap-6 items-center mb-6">
                        <div class="flex items-center justify-center">
                            <UIcon
                                name="i-heroicons-exclamation-triangle-20-solid"
                                class="text-yellow-400 h-12 w-12 translate-y-[3px]"
                            />
                        </div>
                        <div>
                            <p>{{ props.msg }}</p>
                        </div>
                    </div>
                    <div class="flex justify-end gap-[12px]">
                        <UButton
                            color="red"
                            @click="() => {
                                if (props.onConfirm) props.onConfirm();
                            }"
                        >
                            Okay
                        </UButton>
                        <UButton
                            color="white"
                            @click="() => isOpen = false"
                        >
                            Cancel
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>
