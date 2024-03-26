<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen');
const props = defineProps<{
    snapshotInfo: {
        name: string,
        description: string,
    },
    onConfirm: (() => Promise<void>) | null,
}>();

const submitSnapshotEdit = async () => {
    isOpen.value = false;
    props.onConfirm && props.onConfirm();
}
</script>

<template>
    <div>
        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '' }">
                <template #header>
                    <h2>Snapshot Edit</h2>
                </template>
                <template #default>
                    <UForm class="space-y-4" :state="snapshotInfo" @submit="submitSnapshotEdit">
                        <UFormGroup label="Name" name="name">
                            <UInput v-model="snapshotInfo.name" />
                        </UFormGroup>
                        <UFormGroup label="Description" name="description">
                            <UInput v-model="snapshotInfo.description" />
                        </UFormGroup>
                        <div class="flex justify-end">
                            <UButton type="submit">
                                Submit
                            </UButton>
                            <UButton variant="outline" class="ml-2" @click="() => isOpen = false">
                                Cancel
                            </UButton>

                        </div>
                    </UForm>
                </template>
            </UCard>
        </UModal>
    </div>
</template>
