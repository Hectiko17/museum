<template>
    <AuthLayout>
      <div class="w-full max-w-md mx-auto">
        <div class="mb-10">
          <NuxtLink to="/" class="inline-flex items-center text-blue-600 hover:text-blue-700">
            <Icon name="mdi:arrow-left" class="mr-2" />
            Volver al inicio
          </NuxtLink>
        </div>
        
        <RegisterForm />
        
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="text-center">
            <p class="text-sm text-gray-500">
              Al registrarte, aceptas nuestras políticas de privacidad y manejo de datos.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    middleware: defineMiddleware(() => import('~/middleware/auth'))
  })
  </script>