<template>
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <!-- Header simple -->
      <header class="py-6 px-6">
        <div class="max-w-7xl mx-auto">
          <NuxtLink to="/" class="inline-flex items-center space-x-2 text-gray-800 hover:text-gray-900">
            <Icon name="mdi:museum" class="text-xl" />
            <span class="font-semibold">Museum</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="flex-1 flex items-center justify-center p-6">
        <div class="w-full">
          <slot />
        </div>
      </main>

      <!-- Footer minimalista -->
      <footer class="py-6 px-6 border-t border-gray-200">
        <div class="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© {{ new Date().getFullYear() }} Museum System. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  </template>