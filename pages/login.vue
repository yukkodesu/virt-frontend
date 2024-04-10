<template>
    <div>
        <NuxtLayout name="login">
            <Teleport to="body">
                <AlertModal
                    :alert-msg="alertMsg"
                    :show="isAlertShow"
                    icon="i-heroicons-x-circle-16-solid"
                    :close="() => { isAlertShow = false }"
                />
            </Teleport>
            <div class="container mx-auto grid place-items-center h-full w-full">
                <div
                    class="w-[400px] rounded-lg shadow border-solid border border-grey-200 p-8 flex flex-col gap-4 bg-white/30 backdrop-blur font-sans text-gray-800"
                >
                    <h2 class="text-xl">
                        Login
                    </h2>
                    <form class="flex flex-col gap-4">
                        <div class="flex flex-col gap-1">
                            <label>UserName</label>
                            <UInput
                                v-model="user.username"
                                type="text"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label>Password</label>
                            <UInput
                                v-model="user.password"
                                type="password"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div class="flex justify-end">
                            <UButton @click="login">
                                Sign In
                            </UButton>
                        </div>
                    </form>
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
const { authenticateUser } = authStore;
const user = ref({
    username: '',
    password: '',
});
const alertMsg = ref('');
const isAlertShow = ref(false);

const login = async () => {
    try {
        await authenticateUser(user.value);
        navigateTo('/');
    }
    catch (e) {
        isAlertShow.value = true;
        if (e.statusCode === 401) {
            alertMsg.value = 'Username or password is wrong';
        }
        else {
            alertMsg.value = e.message;
        }
    }
};
</script>
