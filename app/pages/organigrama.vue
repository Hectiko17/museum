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
          <NuxtLink to="/organigrama" class="nav-link active">Organigrama</NuxtLink>
          <NuxtLink to="/eventos" class="nav-link">Eventos</NuxtLink>
        </div>
        <div class="nav-right">
          <button @click="cerrarSesion" class="tunas-btn-logout">Cerrar sesión</button>
        </div>
      </nav>
  
      <main class="tunas-container">
        <h1 class="page-title">Organigrama de Museos</h1>
        <p class="page-subtitle">Seleccioná una provincia</p>
        
        <div class="items-grid">
          <div v-for="p in provincias" :key="p.nombre" class="item-card" @click="irA(p.nombre)">
            <div class="item-icon">🗺️</div>
            <h2>{{ p.nombre }}</h2>
            <p class="item-stats">{{ p.municipios.length }} municipios</p>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { provincias } from '../assets/data'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const irA = (provincia) => router.push(`/provincia?nombre=${encodeURIComponent(provincia)}`)
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
  .item-card h2 { color: #CE1126; font-size: 1.3rem; margin-bottom: 0.5rem; }
  .item-stats { color: #009B3A; font-weight: 500; margin: 0; }
  .page-subtitle { color: #666; margin-bottom: 2rem; }
  </style>