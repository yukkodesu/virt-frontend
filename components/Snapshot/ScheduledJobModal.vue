<template>
    <div>
        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h2 class="text-base font-semibold">Create Scheduled Snapshot Job for {{ props.domain }}</h2>
                </template>
                <UForm class="space-y-4 flex flex-col" :state="state" @submit="submit">
                    <UFormGroup label="Cron Expression" name="cron">
                        <UInput v-model="state.cron" />
                    </UFormGroup>

                    <UButton type="submit" class="self-end">
                        Submit
                    </UButton>
                </UForm>
            </UCard>

        </UModal>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    domain: string;
    onConfirm: (() => Promise<void>) | null;
}>();

const state = ref({
    cron: "",
})

const isOpen = ref(true);

const submit = async () => {
    isOpen.value = false;
    props.onConfirm && props.onConfirm();
};
</script>