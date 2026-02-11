<template>
  <div class="tunas-page">
    <div class="tunas-card">
      <h1 class="tunas-title">✍️ Crear cuenta</h1>
      <p class="tunas-subtitle">Completá tus datos</p>

      <form @submit.prevent="registro">
        <label class="tunas-label">Nombre completo</label>
        <input 
          v-model="form.nombre"
          type="text"
          placeholder="Juan Pérez"
          class="tunas-input"
          required
        />

        <label class="tunas-label">Email</label>
        <input 
          v-model="form.email"
          type="email"
          placeholder="tu@email.com"
          class="tunas-input"
          required
        />

        <label class="tunas-label">Contraseña</label>
        <input 
          v-model="form.password"
          type="password"
          placeholder="mínimo 6 caracteres"
          class="tunas-input"
          minlength="6"
          required
        />

        <label class="tunas-label">Confirmar contraseña</label>
        <input 
          v-model="form.confirmPassword"
          type="password"
          placeholder="repetí tu contraseña"
          class="tunas-input"
          minlength="6"
          required
        />

        <div v-if="error" class="tunas-error">
          ⚠️ {{ error }}
        </div>

        <button type="submit" :disabled="cargando" class="tunas-btn">
          {{ cargando ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="tunas-link">
          ← Volver al inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  nombre: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const cargando = ref(false)

const registro = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  if (form.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  cargando.value = true
  error.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    window.location.href = `/?email=${encodeURIComponent(form.email)}`
  } catch {
    error.value = 'Error al registrar. Intentalo de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>