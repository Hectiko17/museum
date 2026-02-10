// stores/auth.ts - Store optimizado para NestJS
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthResponse } from '../services/api/auth' // Tipo separado
import { authService } from '../services/api/auth' // Valor separado

interface User {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userId = computed(() => user.value?.id || null)

  // Acciones
  const register = async (name: string, email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.register({
        name,
        email,
        password
      })

      setAuthData(response)
      return { success: true, data: response }
    } catch (err: any) {
      error.value = err.message || 'Error en el registro'
      return { success: false, error: err }
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login({
        email,
        password
      })

      setAuthData(response)
      return { success: true, data: response }
    } catch (err: any) {
      error.value = err.message || 'Error en el login'
      return { success: false, error: err }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Error en logout:', err)
    } finally {
      clearAuthData()
    }
  }

  const initialize = async () => {
    const savedUser = localStorage.getItem('museum_user')
    const savedAccessToken = localStorage.getItem('museum_access_token')
    const savedRefreshToken = localStorage.getItem('museum_refresh_token')

    if (savedUser && savedAccessToken) {
      user.value = JSON.parse(savedUser)
      accessToken.value = savedAccessToken
      refreshToken.value = savedRefreshToken

      // TODO: Validar token con API
    }
  }

  // Helpers
  const setAuthData = (response: AuthResponse) => {
    user.value = response.user
    accessToken.value = response.access_token
    refreshToken.value = response.refresh_token || null

    localStorage.setItem('museum_user', JSON.stringify(response.user))
    localStorage.setItem('museum_access_token', response.access_token)
    if (response.refresh_token) {
      localStorage.setItem('museum_refresh_token', response.refresh_token)
    }
  }

  const clearAuthData = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    localStorage.removeItem('museum_user')
    localStorage.removeItem('museum_access_token')
    localStorage.removeItem('museum_refresh_token')
  }

  return {
    // Estado
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    userId,
    
    // Acciones
    register,
    login,
    logout,
    initialize,
    
    // Métodos públicos para componentes
    clearError: () => { error.value = null }
  }
})