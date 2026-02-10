// middleware/auth.ts - DEBE estar en la carpeta raíz '/middleware'
import { useAuthStore } from '../stores/auth'

// Usa funciones globales de Nuxt (se auto-importan)
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()
    
    // Inicializar store
    authStore.initialize()
    
    // Rutas que requieren autenticación
    const protectedRoutes = ['/dashboard', '/perfil', '/efermerides']
    const isProtected = protectedRoutes.some(route => 
      to.path.startsWith(route)
    )
    
    // Rutas de autenticación (solo para guests)
    const authRoutes = ['/logeo', '/auth/registro']
    const isAuthRoute = authRoutes.includes(to.path)
    
    // Redirecciones
    if (isProtected && !authStore.isAuthenticated) {
      return navigateTo('/logeo')
    }
    
    if (isAuthRoute && authStore.isAuthenticated) {
      return navigateTo('/dashboard')
    }
})