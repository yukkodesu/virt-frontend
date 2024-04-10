// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxt/ui',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxt/eslint',
        '@nuxtjs/eslint-module',
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    pinia: {
        storesDirs: ['./store/**'],
    },
    routeRules: {
        '/api/**': {
            proxy: { to: 'http://localhost:8000/api/**' },
        },
    },
});
