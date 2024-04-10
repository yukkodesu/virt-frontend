<template>
    <UCard
        :ui="{
            body: {
                padding: 'sm:p-4',
            },
        }"
    >
        <div v-if="snapshotInfo">
            <h3 class="text-sm/6 text-gray-900 font-semibold truncate">
                {{ snapshotInfo.name }} Info
            </h3>
            <ul class="flex flex-col gap-2 pt-4">
                <li class="flex gap-2">
                    <span class="block text-sm/6 text-gray-700">Name:</span>
                    <span class="block text-sm/6 text-gray-500">{{ snapshotInfo.name }}</span>
                </li>
                <li class="flex gap-2">
                    <span class="block text-sm/6 text-gray-700">Create Time:</span>
                    <span class="block text-sm/6 text-gray-500">{{ dayjs(Number(snapshotInfo.creationTime)
                        * 1000).format('lll') }}</span>
                </li>
                <li class="flex gap-2">
                    <span class="block text-sm/6 text-gray-700">State:</span>
                    <span class="block text-sm/6 text-gray-500">{{ snapshotInfo.state }}</span>
                </li>
                <li class="flex gap-2">
                    <span class="block text-sm/6 text-gray-700">Description:</span>
                    <span class="block text-sm/6 text-gray-500">{{ snapshotInfo.description === "" ? "None" : snapshotInfo.description }}</span>
                </li>
            </ul>
        </div>
        <div v-else>
            <h3 class="text-sm/6 text-gray-900 font-semibold truncate">
                No Snapshot Selected
            </h3>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
defineProps<{
    snapshotInfo: {
        name: string;
        creationTime: string;
        state: string;
        description: string;
    } | null | undefined;
}>();
</script>
