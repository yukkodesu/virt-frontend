<template>
    <div>
        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h2 class="text-base font-semibold">Create Scheduled Snapshot Job for {{ props.domain }}</h2>
                </template>
                <UForm class="space-y-4 flex flex-col" :state="state" :schema="schema" @submit="submit">
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
import { object, addMethod, string } from 'yup';
import cron from 'cron-validate';

const props = defineProps<{
    domain: string;
    onConfirm: (() => Promise<void>) | null;
}>();

addMethod(string, 'isCronExpression', function () {
    return this.test('isCronExpression', 'Invalid cron expression', (value): boolean => {
        if (!value) return false;
        return cron(value, {
            override: {
                useSeconds: true,
            }
        }).isValid();
    });
});

declare module "yup" {
    interface StringSchema {
        isCronExpression(): StringSchema;
    }
}

const schema = object({
    cron: string().isCronExpression().required("Cron Expression Required"),
})

// type Schema = InferType<typeof schema>

const state = ref({
    cron: "",
})

const isOpen = ref(true);

const submit = async () => {
    isOpen.value = false;
    props.onConfirm && props.onConfirm();
};
</script>