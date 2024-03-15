<template>
    <div class="py-2">
        <div class=" max-w-fit">
            <USelectMenu v-model="selected" :options="options" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useVirtStore } from '~/store/virt';
const virtStore = useVirtStore();
const { domains, updateDomains } = virtStore;
await callOnce(updateDomains);
const options = ref([]);
const selected = ref("Loading");
domains.map(it => options.value.push(it['name']));
selected.value = (options.value)[0];
</script>