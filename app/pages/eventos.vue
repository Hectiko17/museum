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
          <NuxtLink to="/eventos" class="nav-link active">Eventos</NuxtLink>
        </div>
  
        <div class="nav-right">
          <button @click="cerrarSesion" class="tunas-btn-logout">
            Cerrar sesión
          </button>
        </div>
      </nav>
  
      <main class="tunas-container">
        <h1 class="page-title">Eventos culturales</h1>
        
        <div class="coming-soon">
          <div class="coming-soon-icon">🎭</div>
          <h2>Próximamente</h2>
          <p>Estamos trabajando en esta sección</p>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  const cerrarSesion = () => {
    window.location.href = '/'
  }
  </script>