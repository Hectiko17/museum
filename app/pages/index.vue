<template>
  <div class="tunas-page">
    <div class="tunas-card">
      <h1 class="tunas-title">🏛️ Museo Local</h1>
      <p class="tunas-subtitle">Las Tunas</p>
      
      <div v-if="emailRegistrado" class="tunas-success">
        ✅ ¡Registro exitoso! Ingresá tu contraseña.
      </div>

      <form @submit.prevent="login">
        <label class="tunas-label">Email</label>
        <input 
          v-model="form.email"
          type="email"
          :placeholder="emailRegistrado || 'tu@email.com'"
          class="tunas-input"
          required
        />

        <label class="tunas-label">Contraseña</label>
        <input 
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          class="tunas-input"
          required
        />

        <button type="submit" class="tunas-btn">
          Iniciar Sesión
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="tunas-text-muted">
          ¿No tenés cuenta?
          <NuxtLink to="/registro" class="tunas-link">
            Registrate
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const form = reactive({ email: '', password: '' })
const emailRegistrado = ref('')

onMounted(() => {
  if (route.query.email) {
    emailRegistrado.value = route.query.email
    form.email = route.query.email
  }
})

const login = () => {
  window.location.href = '/dashboard'
}
</script>