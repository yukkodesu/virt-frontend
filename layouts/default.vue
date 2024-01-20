<template>
    <NavBar></NavBar>
    <div class="grid grid-cols-10 gap-8 mx-auto px-8 max-w-7xl">
        <div class="top-[64px] sticky h-min col-span-2 overflow-y-auto">
            <slot name="aside" />
        </div>
        <div class="h-[1000px] col-span-8">
            <slot />
        </div>
    </div>
</template>
