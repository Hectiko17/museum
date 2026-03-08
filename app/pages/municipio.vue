<template>
  <div>
    <nav class="tunas-header">
      <div class="tunas-logo">
        <span>🏛️</span>
        Museo Local
      </div>
      <div class="nav-center">
        <NuxtLink to="/dashboard" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/efemerides" class="nav-link">Efemérides</NuxtLink>
        <NuxtLink to="/organigrama" class="nav-link">Organigrama</NuxtLink>
        <NuxtLink to="/eventos" class="nav-link">Eventos</NuxtLink>
      </div>
      <div class="nav-right">
        <button @click="cerrarSesion" class="tunas-btn-logout">Cerrar sesión</button>
      </div>
    </nav>

    <main class="tunas-container">
      <div class="breadcrumb">
        <NuxtLink to="/organigrama" class="tunas-link">Organigrama</NuxtLink>
        <span class="separator">›</span>
        <NuxtLink :to="`/provincia?nombre=${encodeURIComponent(provinciaNombre)}`" class="tunas-link">
          {{ provinciaNombre }}
        </NuxtLink>
        <span class="separator">›</span>
        <span>{{ municipioNombre }}</span>
      </div>

      <h1 class="page-title">{{ municipioNombre }}</h1>
      <p class="page-subtitle">Seleccioná un museo</p>
      
      <div v-if="museos.length" class="items-grid">
        <div v-for="m in museos" :key="m.id" class="item-card" @click="irA(m.id)">
          <div class="item-icon">🏛️</div>
          <h2>{{ m.nombre }}</h2>
          <p class="item-direccion">{{ m.direccion }}</p>
        </div>
      </div>
      <div v-else class="no-data">No hay museos en este municipio</div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMuseosByMunicipio } from '../assets/data'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const provinciaNombre = ref('')
const municipioNombre = ref('')
const museos = ref([])

onMounted(() => {
  provinciaNombre.value = route.query.provincia
  municipioNombre.value = route.query.municipio
  if (!provinciaNombre.value || !municipioNombre.value) {
    router.push('/organigrama')
    return
  }
  museos.value = getMuseosByMunicipio(provinciaNombre.value, municipioNombre.value)
})

const irA = (id) => router.push(`/museo?id=${id}`)
const cerrarSesion = () => window.location.href = '/'
</script>

<style scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.item-card {
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}
.item-card:hover {
  border-color: #009B3A;
  box-shadow: 0 8px 24px rgba(0, 155, 58, 0.12);
  transform: translateY(-4px);
}
.item-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.item-card h2 { color: #CE1126; font-size: 1.2rem; margin-bottom: 0.5rem; }
.item-direccion { color: #666; font-size: 0.9rem; margin: 0; }
.breadcrumb { margin-bottom: 2rem; color: #666; }
.separator { margin: 0 0.5rem; font-size: 1.2rem; }
.no-data { text-align: center; padding: 3rem; background: #F9F9F9; border-radius: 16px; color: #666; }
</style>