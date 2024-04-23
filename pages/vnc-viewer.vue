<template>
    <div class="w-screen h-screen p-0 m-0">
        <VMVncComponent 
        :port="route.query.port" 
        :password="route.query.password" 
        :view-only="false"
        :is-connection-available="isConnectable" />
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "VNC Viewer",
});
const route = useRoute();

const isConnectable = ref(false);

onMounted(() => {
    isConnectable.value = true;
})
</script>