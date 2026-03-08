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
          <span>{{ provincia?.nombre }}</span>
        </div>
  
        <h1 class="page-title">{{ provincia?.nombre }}</h1>
        <p class="page-subtitle">Seleccioná un municipio</p>
        
        <div class="items-grid">
          <div v-for="m in provincia?.municipios || []" :key="m.nombre" class="item-card" 
               @click="irA(provincia.nombre, m.nombre)">
            <div class="item-icon">🏘️</div>
            <h2>{{ m.nombre }}</h2>
            <p class="item-stats">{{ m.museos.length }} museos</p>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { provincias } from '../assets/data'
  import { useRoute, useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  const provincia = ref(null)
  
  onMounted(() => {
    const nombre = route.query.nombre
    provincia.value = provincias.find(p => p.nombre === nombre)
    if (!provincia.value) router.push('/organigrama')
  })
  
  const irA = (provincia, municipio) => router.push(`/municipio?provincia=${encodeURIComponent(provincia)}&municipio=${encodeURIComponent(municipio)}`)
  const cerrarSesion = () => window.location.href = '/'
  </script>
  
  <style scoped>
  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .item-card {
    background: white;
    border: 1px solid #E0E0E0;
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .item-card:hover {
    border-color: #009B3A;
    box-shadow: 0 8px 24px rgba(0, 155, 58, 0.12);
    transform: translateY(-4px);
  }
  .item-icon { font-size: 3rem; margin-bottom: 1rem; }
  .item-card h2 { color: #CE1126; font-size: 1.2rem; margin-bottom: 0.5rem; }
  .item-stats { color: #009B3A; font-weight: 500; margin: 0; }
  .breadcrumb { margin-bottom: 2rem; color: #666; }
  .separator { margin: 0 0.5rem; font-size: 1.2rem; }
  </style>