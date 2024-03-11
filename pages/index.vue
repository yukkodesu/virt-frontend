<template>
    <NuxtLayout>
        <template #aside>
            <IndexAsideBar />
        </template>
        <template #default>
            <AlertProvider>
                <NuxtPage />
            </AlertProvider>
        </template>
    </NuxtLayout>
</template>