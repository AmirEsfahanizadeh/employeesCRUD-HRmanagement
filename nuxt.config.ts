import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  components: true,
  compatibilityDate: '2025-09-04',
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss' // if using Tailwind
  ],
  css: [
    'vue-virtual-scroller/dist/vue-virtual-scroller.css'
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://dummyjson.com'
    }
  }
})