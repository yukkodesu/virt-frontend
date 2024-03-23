<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen');
const snapshotInfo = defineModel<{
    name: string,
    description: string,
}>('snapshotInfo');
const emit = defineEmits(['submit']);

const submitSnapshotEdit = async () => {
    emit('submit');
    isOpen.value = false;
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
                        <UButton type="submit">
                            Submit
                        </UButton>
                    </UForm>
                </template>
            </UCard>
        </UModal>
    </div>
</template>
