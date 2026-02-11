<template>
  <div>
    <header class="tunas-header">
      <div class="tunas-logo">
        <span>🏛️</span>
        Museo Local
      </div>
      <button @click="cerrarSesion" class="tunas-btn-secondary tunas-btn" style="width: auto;">
        Cerrar sesión
      </button>
    </header>

    <main class="tunas-container">
      <div class="tunas-card" style="max-width: 100%;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #E8F5E9; padding: 0.8rem 1.2rem; border-radius: 999px;">
            <span style="color: #009B3A; font-size: 1.5rem;">👤</span>
          </div>
          <div>
            <h1 style="color: #CE1126; font-size: 1.8rem; font-weight: 300; margin: 0;">
              ¡Bienvenido!
            </h1>
            <p style="color: #009B3A; margin: 0;">
              Has iniciado sesión correctamente
            </p>
          </div>
        </div>

        <div class="tunas-grid">
          <NuxtLink to="/efemerides" class="tunas-dashboard-card" style="text-decoration: none;">
            <div class="tunas-icon">📅</div>
            <h3 style="color: #CE1126; margin-bottom: 0.5rem;">Efemérides</h3>
            <p style="color: #666; margin: 0; font-size: 0.9rem;">
              Explorá la historia de Las Tunas
            </p>
          </NuxtLink>

          <div class="tunas-dashboard-card" style="opacity: 0.7;">
            <div class="tunas-icon">🖼️</div>
            <h3 style="color: #009B3A; margin-bottom: 0.5rem;">Colecciones</h3>
            <p style="color: #666; margin: 0; font-size: 0.9rem;">
              Próximamente
            </p>
            <span class="tunas-badge">Pronto</span>
          </div>

          <div class="tunas-dashboard-card" style="opacity: 0.7;">
            <div class="tunas-icon">🎭</div>
            <h3 style="color: #009B3A; margin-bottom: 0.5rem;">Eventos</h3>
            <p style="color: #666; margin: 0; font-size: 0.9rem;">
              Próximamente
            </p>
            <span class="tunas-badge">Pronto</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const cerrarSesion = () => {
  window.location.href = '/'
}
</script>