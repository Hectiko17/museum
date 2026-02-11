// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Si el usuario no está autenticado y no está en login/registro
  if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/registro') {
    return navigateTo('/login')
  }
  
  // Si el usuario está autenticado y trata de ir a login/registro
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/registro')) {
    return navigateTo('/dashboard')
  }
})