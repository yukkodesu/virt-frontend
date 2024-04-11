<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen');
const props = defineProps<{
    snapshotInfo: {
        name: string;
        parent?: string;
        description: string;
    };
    isCreate: boolean;
    snapshotList: {
        isCurrent: string;
        state: string;
        creationTime: string;
        name: string;
        description: string;
    }[] | null;
    onConfirm: (() => Promise<void>) | null;
}>();

const opts = computed<string[]>(() => {
    if(!props.snapshotList) return [];
    const snapshots = props.snapshotList.map(it => it.name);
    snapshots.push("Current");
    return snapshots;
})

const submitSnapshotEdit = async () => {
    isOpen.value = false;
    props.onConfirm && props.onConfirm();
};
</script>

<template>
    <div>
        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '' }">
                <template #header>
                    <h2 v-if="!isCreate" class="text-base font-semibold">Edit Snapshot: {{ props.snapshotInfo.name }}</h2>
                    <h2 v-else>Create New Snapshot</h2>
                </template>
                <template #default>
                    <UForm
                        class="space-y-4"
                        :state="snapshotInfo"
                        @submit="submitSnapshotEdit"
                    >
                        <UFormGroup
                            v-if="isCreate"
                            label="From Parent"
                            name="parent"
                        >
                            <!-- eslint-disable-next-line vue/no-mutating-props -->
                            <USelectMenu v-model="snapshotInfo.parent" :options="opts" />
                        </UFormGroup>
                        <UFormGroup
                            v-if="isCreate"
                            label="Name"
                            name="name"
                        >
                            <!-- eslint-disable-next-line vue/no-mutating-props -->
                            <UInput v-model="snapshotInfo.name" />
                        </UFormGroup>
                        <UFormGroup
                            label="Description"
                            name="description"
                        >
                            <!-- eslint-disable-next-line vue/no-mutating-props -->
                            <UInput v-model="snapshotInfo.description" />
                        </UFormGroup>
                        <div class="flex justify-end">
                            <UButton type="submit">
                                Submit
                            </UButton>
                            <UButton
                                variant="outline"
                                class="ml-2"
                                @click="() => isOpen = false"
                            >
                                Cancel
                            </UButton>
                        </div>
                    </UForm>
                </template>
            </UCard>
        </UModal>
    </div>
</template>
