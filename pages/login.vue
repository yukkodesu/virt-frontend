<template>
    <div>
        <NuxtLayout name="login">
            <div class="container mx-auto grid place-items-center h-full w-full">
                <div
                    class="w-[400px] rounded-lg shadow border-solid border border-grey-200 p-8 flex flex-col gap-4 bg-white/30 backdrop-blur text-gray-800">
                    <h2 class="font-sans text-xl">Login</h2>
                    <form class="flex flex-col gap-4">
                        <div class="flex flex-col gap-1">
                            <label>UserName</label>
                            <input v-model="user.username"
                                class="duration-100 rounded-md outline-none border-solid border-2 border-grey-100 focus:border-blue-400 focus:border-2 p-1 px-2"
                                type="text" placeholder="Enter your username">
                        </div>
                        <div class="flex flex-col gap-1">
                            <label>Password</label>
                            <input v-model="user.password"
                                class="duration-100 rounded-md outline-none border-solid border-2 border-grey-100 focus:border-blue-400 focus:border-2 p-1 px-2"
                                type="password" placeholder="Enter your password">
                        </div>
                        <div class="flex justify-end">
                            <button @click.prevent="login"
                                class="duration-100 bg-blue-600 hover:bg-blue-800 px-2 py-1 rounded text-gray-100 font-sans">Sign
                                In</button>
                        </div>
                    </form>
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
const authStore = useAuthStore();
const { authenticateUser } = authStore;
let user = ref({
    username: "",
    password: "",
});

const login = async () => {
    await authenticateUser(user.value);
}

</script>