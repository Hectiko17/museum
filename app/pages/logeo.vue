<template>
    <AuthLayout>
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <Icon name="mdi:museum-outline" class="text-2xl text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Museum System</h1>
          <p class="text-gray-600 mt-2">Accede a tu cuenta para continuar</p>
        </div>
        
        <LoginForm />
        
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            ¿Primera vez aquí?
            <NuxtLink to="/auth/registro" class="font-medium text-blue-600 hover:text-blue-500">
              Crea una cuenta
            </NuxtLink>
          </p>
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