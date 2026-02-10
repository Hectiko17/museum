export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
  
  imports: {
    dirs: ['stores']
  },
  
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001'
    }
  },
  
  devtools: { enabled: true },
  
  css: ['~/assets/css/main.css']
})