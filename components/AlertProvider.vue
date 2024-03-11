<template>
    <slot></slot>
    <Teleport to="body">
        <Alert :alert-msg="alertOpt.msg" :show="alertOpt.show" icon="i-heroicons-x-circle-16-solid"
            :close="() => { alertOpt.show = false }">
        </Alert>
    </Teleport>
</template>
<script setup lang="ts">
import { provide } from 'vue';
const alertOpt = ref({
    msg: "",
    show: false,
})

const showAlert = (msg: string) => {
    alertOpt.value.msg = msg;
    alertOpt.value.show = true;
}
provide<(msg: string) => void>('showAlert', showAlert);
</script>