<template>
  <div>
    <nav class="tunas-header">
      <div class="tunas-logo">
        <span>🏛️</span>
        Museo Local
      </div>

      <div class="nav-center">
        <NuxtLink to="/dashboard" class="nav-link active">Home</NuxtLink>
        <NuxtLink to="/efemerides" class="nav-link">Efemérides</NuxtLink>
        <NuxtLink to="/organigrama" class="nav-link">Organigrama</NuxtLink>
        <NuxtLink to="/eventos" class="nav-link">Eventos</NuxtLink>
      </div>

      <div class="nav-right">
        <input 
          type="text" 
          v-model="busqueda"
          placeholder="Buscar..."
          class="tunas-search-input"
          @keyup.enter="buscar"
        />
        <button @click="cerrarSesion" class="tunas-btn-logout">
          Cerrar sesión
        </button>
      </div>
    </nav>

    <main class="tunas-container">
      <div class="welcome-card">
        <div class="welcome-avatar">👤</div>
        <div>
          <h1 class="welcome-title">¡Bienvenido!</h1>
          <p class="welcome-subtitle">Has iniciado sesión correctamente</p>
        </div>
      </div>

      <section class="section">
        <div class="section-header">
          <h2>Provincias destacadas</h2>
          <NuxtLink to="/organigrama" class="tunas-link">Ver todas →</NuxtLink>
        </div>

        <div class="tunas-grid">
          <div 
            v-for="provincia in provincias.slice(0, 4)" 
            :key="provincia.nombre" 
            class="tunas-dashboard-card"
            @click="irAProvincia(provincia.nombre)"
          >
            <div class="tunas-icon">🗺️</div>
            <h3 class="card-title">{{ provincia.nombre }}</h3>
            <p class="card-text">{{ provincia.municipios.length }} municipios</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { provincias } from '../assets/data'
import { useRouter } from 'vue-router'

const router = useRouter()
const busqueda = ref('')

const buscar = () => {
  if (busqueda.value.trim()) {
    alert(`Buscando: ${busqueda.value}`)
  }
}

const irAProvincia = (nombre) => {
  router.push(`/${encodeURIComponent(nombre)}`)
}

const cerrarSesion = () => {
  window.location.href = '/'
}
</script>

<style scoped>
.tunas-dashboard-card {
  cursor: pointer;
}
</style>