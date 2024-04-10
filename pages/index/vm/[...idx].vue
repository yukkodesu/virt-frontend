<template>
    <p>{{ route.path }}</p>
</template>

<script setup lang="ts">
const route = useRoute();

useHead({
    title: () => `${route.path.split('/').at(2)} - Virt Domains`,
});
</script>
