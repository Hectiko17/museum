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
        <div v-if="museo" class="detalle-museo">
          <div class="museo-header">
            <div class="museo-icon-large">🏛️</div>
            <div>
              <h1 class="page-title">{{ museo.nombre }}</h1>
              <p class="museo-ubicacion">{{ museo.municipio }}, {{ museo.provincia }}</p>
            </div>
          </div>
          
          <div class="detalle-grid">
            <div class="detalle-info">
              <p><strong>📍 Dirección:</strong> {{ museo.direccion }}</p>
              <p><strong>📧 Email:</strong> {{ museo.gmail }}</p>
              <p><strong>📞 Teléfono:</strong> {{ museo.telefono }}</p>
            </div>
            <div class="detalle-mapa">
              <div class="mapa-placeholder">🗺️ Mapa<br><small>próximamente</small></div>
            </div>
          </div>
  
          <button @click="volver" class="tunas-btn-secondary tunas-btn" style="width: auto;">← Volver</button>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getMuseoById } from '../assets/data'
  import { useRoute, useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  const museo = ref(null)
  
  onMounted(() => {
    const id = parseInt(route.query.id)
    museo.value = getMuseoById(id)
    if (!museo.value) router.push('/organigrama')
  })
  
  const volver = () => router.back()
  const cerrarSesion = () => window.location.href = '/'
  </script>
  
  <style scoped>
  .detalle-museo {
    background: #F9F9F9;
    border-radius: 16px;
    padding: 2rem;
    border-left: 6px solid #009B3A;
  }
  .museo-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .museo-icon-large { font-size: 4rem; }
  .museo-ubicacion { color: #009B3A; margin-top: 0.3rem; }
  .detalle-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .detalle-info {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
  }
  .detalle-info p { margin-bottom: 1rem; }
  .detalle-info strong { color: #009B3A; }
  .detalle-mapa {
    background: #E0E0E0;
    border-radius: 12px;
  }
  .mapa-placeholder {
    height: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
  }
  @media (max-width: 700px) {
    .detalle-grid { grid-template-columns: 1fr; }
    .museo-header { flex-direction: column; text-align: center; }
  }
  </style>