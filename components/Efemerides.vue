<template>
  <section class="efemerides-museum">
    <!-- Encabezado tipo monumento -->
    <header class="memorial-header">
      <div class="header-badge">
        <span class="badge-tunas">🇨🇺 LAS TUNAS</span>
        <span class="badge-year">desde 1796</span>
      </div>
      
      <div class="title-block">
        <h1 class="main-title">
          <span class="title-word">MEMORIA</span>
          <span class="title-word accent">VIVA</span>
        </h1>
        <p class="subtitle">Efemérides nacionales con raíz tunera</p>
      </div>

      <div class="search-panel">
        <div class="input-group">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16 16L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="q"
            class="search-input"
            placeholder="Buscar efeméride, figura histórica, lugar..."
          />
        </div>
        
        <div class="filter-group">
          <div class="month-selector">
            <button 
              v-for="m in months" 
              :key="m.value"
              class="month-pill"
              :class="{ active: selectedMonth === m.value }"
              @click="selectedMonth = selectedMonth === m.value ? 0 : m.value"
            >
              {{ m.name.slice(0, 3) }}
              <span v-if="selectedMonth === m.value" class="pill-indicator"></span>
            </button>
            <button 
              v-if="selectedMonth !== 0" 
              class="month-clear"
              @click="selectedMonth = 0"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Barra de estadísticas -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ totalEfemerides }}</span>
        <span class="stat-label">efemérides</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ localCount }}</span>
        <span class="stat-label">tuneras</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ uniqueTags.length }}</span>
        <span class="stat-label">etiquetas</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item highlight">
        <span class="stat-value">{{ currentMonthName }}</span>
        <span class="stat-label">en curso</span>
      </div>
    </div>

    <main class="main-grid">
      <!-- Timeline principal -->
      <div class="timeline-container">
        <transition-group name="timeline" tag="div" class="timeline-track">
          <article
            v-for="(e, index) in filtered"
            :key="e.title + e.month + e.day + index"
            class="timeline-card"
            :class="{
              'local-event': isLocal(e),
              'national-event': !isLocal(e)
            }"
          >
            <!-- Línea decorativa izquierda -->
            <div class="card-marker">
              <div class="marker-dot" :class="{ 'dot-local': isLocal(e) }"></div>
              <div class="marker-line"></div>
            </div>

            <!-- Contenido principal -->
            <div class="card-content">
              <div class="card-header-compact">
                <time class="event-date" datetime="YYYY-MM-DD">
                  <span class="date-day">{{ e.day }}</span>
                  <span class="date-month">{{ monthName(e.month).substring(0, 3) }}</span>
                  <span class="date-year">{{ e.year || '' }}</span>
                </time>
                
                <div class="title-wrapper">
                  <h2 class="event-title">{{ e.title }}</h2>
                  <div class="province-badge" :class="{ 'badge-tunas': isLocal(e) }">
                    <span v-if="isLocal(e)" class="badge-icon">🌴</span>
                    {{ isLocal(e) ? 'Las Tunas' : 'Nacional' }}
                  </div>
                </div>
              </div>

              <p class="event-description">{{ e.description }}</p>
              
              <div class="card-footer">
                <div class="tag-cloud">
                  <span v-for="t in e.tags || []" :key="t" class="tag-item">
                    #{{ t }}
                  </span>
                </div>
                
                <button class="expand-button" aria-label="Ver más detalles">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Sello conmemorativo para eventos locales -->
            <div v-if="isLocal(e)" class="commemorative-seal">
              <span>⚔️</span>
            </div>
          </article>
          
          <div v-if="filtered.length === 0" class="empty-state">
            <div class="empty-illustration">🏛️</div>
            <h3>No se encontraron efemérides</h3>
            <p>Intenta con otros términos o restablece los filtros</p>
            <button class="reset-button" @click="resetFilters">Limpiar filtros</button>
          </div>
        </transition-group>
      </div>

      <!-- Sidebar tipo archivo histórico -->
      <aside class="archive-sidebar">
        <!-- Destacados rotativos -->
        <div class="archive-card highlights">
          <div class="archive-header">
            <span class="archive-icon">🏆</span>
            <h3>Hitos tuneros</h3>
          </div>
          <div class="rotating-highlight">
            <transition name="fade" mode="out-in">
              <div :key="currentHighlight.title" class="highlight-item">
                <div class="highlight-date">
                  {{ monthName(currentHighlight.month) }} {{ currentHighlight.day }}
                </div>
                <div class="highlight-title">
                  {{ currentHighlight.title }}
                </div>
                <div class="highlight-year" v-if="currentHighlight.year">
                  {{ currentHighlight.year }}
                </div>
              </div>
            </transition>
          </div>
          <div class="highlight-nav">
            <button @click="prevHighlight" class="nav-arrow">←</button>
            <span class="nav-counter">{{ highlightIndex + 1 }} / {{ localHighlights.length }}</span>
            <button @click="nextHighlight" class="nav-arrow">→</button>
          </div>
        </div>

        <!-- Calendario mensual minimal -->
        <div class="archive-card calendar-mini">
          <div class="archive-header">
            <span class="archive-icon">📅</span>
            <h3>{{ currentMonthName }} {{ new Date().getFullYear() }}</h3>
          </div>
          <div class="month-preview">
            <span v-for="d in 7" :key="d" class="calendar-dot" 
                  :class="{ 'event-dot': hasEventOnDay(d) }">
            </span>
            <span class="calendar-hint">eventos este mes</span>
          </div>
        </div>

        <!-- Línea de tiempo de provincias -->
        <div class="archive-card provinces">
          <div class="archive-header">
            <span class="archive-icon">🗺️</span>
            <h3>Origen geográfico</h3>
          </div>
          <div class="province-stats">
            <div class="province-bar">
              <span class="province-name">Las Tunas</span>
              <span class="province-count">{{ localCount }}</span>
              <div class="bar-bg">
                <div class="bar-fill tunas" :style="{ width: localPercentage + '%' }"></div>
              </div>
            </div>
            <div class="province-bar">
              <span class="province-name">Nacional</span>
              <span class="province-count">{{ nationalCount }}</span>
              <div class="bar-bg">
                <div class="bar-fill national" :style="{ width: nationalPercentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Nube de etiquetas interactiva -->
        <div class="archive-card tags-cloud">
          <div class="archive-header">
            <span class="archive-icon">🏷️</span>
            <h3>Etiquetas frecuentes</h3>
          </div>
          <div class="tags-flex">
            <button
              v-for="tag in topTags"
              :key="tag.name"
              class="tag-cloud-btn"
              :style="{ fontSize: 12 + tag.count * 1.8 + 'px' }"
              @click="q = tag.name"
            >
              #{{ tag.name }}
            </button>
          </div>
        </div>
      </aside>
    </main>

    <!-- Footer institucional -->
    <footer class="museum-footer">
      <div class="footer-wave"></div>
      <div class="footer-content">
        <span>© 2025 Museo Provincial "Vicente García"</span>
        <span class="footer-divider">|</span>
        <span>Archivo histórico de Las Tunas</span>
        <span class="footer-divider">|</span>
        <span>Total de registros: {{ efemerides.length }}</span>
      </div>
    </footer>
  </section>
</template>

<script setup>
import efemerides from "../data/efemerides.json";
import { ref, computed, onMounted, watch } from "vue";

// Estados
const q = ref("");
const selectedMonth = ref(0);
const highlightIndex = ref(0);
const currentHighlight = ref({});

// Datos
const months = [
  { value: 1, name: "Enero" },
  { value: 2, name: "Febrero" },
  { value: 3, name: "Marzo" },
  { value: 4, name: "Abril" },
  { value: 5, name: "Mayo" },
  { value: 6, name: "Junio" },
  { value: 7, name: "Julio" },
  { value: 8, name: "Agosto" },
  { value: 9, name: "Septiembre" },
  { value: 10, name: "Octubre" },
  { value: 11, name: "Noviembre" },
  { value: 12, name: "Diciembre" },
];

// Helpers
function monthName(m) {
  const found = months.find((x) => x.value === m);
  return found ? found.name : "";
}

function isLocal(e) {
  return (e.province || "").toLowerCase() === "las tunas";
}

// Computed
const totalEfemerides = computed(() => efemerides.length);

const localCount = computed(() => 
  efemerides.filter(e => isLocal(e)).length
);

const nationalCount = computed(() => 
  efemerides.filter(e => e.province === "Nacional").length
);

const localPercentage = computed(() => 
  ((localCount.value / totalEfemerides.value) * 100).toFixed(1)
);

const nationalPercentage = computed(() => 
  ((nationalCount.value / totalEfemerides.value) * 100).toFixed(1)
);

const currentMonthName = computed(() => 
  monthName(new Date().getMonth() + 1)
);

const localHighlights = computed(() =>
  efemerides
    .filter((e) => isLocal(e))
    .sort((a, b) => a.month - b.month || a.day - b.day)
);

const uniqueTags = computed(() => {
  const tags = new Set();
  efemerides.forEach(e => e.tags?.forEach(t => tags.add(t)));
  return Array.from(tags);
});

const topTags = computed(() => {
  const freq = {};
  efemerides.forEach(e => e.tags?.forEach(t => freq[t] = (freq[t] || 0) + 1));
  return Object.entries(freq)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
});

const filtered = computed(() => {
  const qv = q.value.trim().toLowerCase();
  return efemerides
    .filter((e) => {
      if (!(e.province === "Nacional" || isLocal(e))) return false;
      if (selectedMonth.value && e.month !== selectedMonth.value) return false;
      if (!qv) return true;
      const text = (
        (e.title || "") + " " +
        (e.description || "") + " " +
        (e.tags || []).join(" ")
      ).toLowerCase();
      return text.includes(qv);
    })
    .sort((a, b) => a.month - b.month || a.day - b.day);
});

// Highlight rotativo
watch(localHighlights, (highlights) => {
  if (highlights.length > 0) {
    currentHighlight.value = highlights[0];
  }
}, { immediate: true });

function nextHighlight() {
  if (localHighlights.value.length === 0) return;
  highlightIndex.value = (highlightIndex.value + 1) % localHighlights.value.length;
  currentHighlight.value = localHighlights.value[highlightIndex.value];
}

function prevHighlight() {
  if (localHighlights.value.length === 0) return;
  highlightIndex.value = (highlightIndex.value - 1 + localHighlights.value.length) % localHighlights.value.length;
  currentHighlight.value = localHighlights.value[highlightIndex.value];
}

function hasEventOnDay(day) {
  return efemerides.some(e => 
    e.month === new Date().getMonth() + 1 && 
    e.day === day && 
    (e.province === "Nacional" || isLocal(e))
  );
}

function resetFilters() {
  q.value = "";
  selectedMonth.value = 0;
}

onMounted(() => {
  console.log("Efemérides — Museo Provincial, Las Tunas");
});
</script>

<style scoped>
:root {
  --tunas-red: #b31b1b;
  --tunas-green: #1e6b3b;
  --tunas-red-soft: rgba(179, 27, 27, 0.08);
  --tunas-green-soft: rgba(30, 107, 59, 0.06);
  --paper: #fcf9f2;
  --ink: #1e1e1e;
  --stone: #4a4a4a;
  --sand: #e8e0d5;
  --archival: #2c1810;
  --gold: #bf9e5a;
}

.efemerides-museum {
  max-width: 1440px;
  margin: 0 auto;
  background: var(--paper);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--ink);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
}

/* Header memorial */
.memorial-header {
  background: linear-gradient(135deg, #ffffff 0%, #faf5ed 100%);
  padding: 2rem 2.5rem;
  border-bottom: 1px solid rgba(30, 107, 59, 0.15);
  position: relative;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.badge-tunas {
  background: linear-gradient(145deg, var(--tunas-red), #8f1515);
  color: white;
  padding: 0.35rem 1rem;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 8px rgba(179, 27, 27, 0.2);
}

.badge-year {
  color: var(--tunas-green);
  font-weight: 600;
  font-size: 0.9rem;
  background: rgba(30, 107, 59, 0.08);
  padding: 0.35rem 1rem;
  border-radius: 40px;
}

.title-block {
  margin-bottom: 1.75rem;
}

.main-title {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
  font-size: 2.75rem;
  font-weight: 700;
}

.title-word.accent {
  color: var(--tunas-red);
  position: relative;
}

.title-word.accent::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(179, 27, 27, 0.12);
  z-index: 0;
}

.subtitle {
  color: var(--stone);
  font-size: 1.2rem;
  font-weight: 400;
  margin: 0;
  position: relative;
  padding-left: 1.5rem;
  border-left: 3px solid var(--tunas-green);
}

/* Search panel */
.search-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  position: relative;
  max-width: 600px;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--tunas-green);
  opacity: 0.7;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1.5px solid rgba(30, 107, 59, 0.12);
  border-radius: 60px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--tunas-green);
  box-shadow: 0 8px 20px rgba(30, 107, 59, 0.12);
}

.month-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}

.month-pill {
  background: transparent;
  border: 1px solid rgba(30, 107, 59, 0.15);
  color: var(--stone);
  padding: 0.5rem 0.9rem;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}

.month-pill.active {
  background: var(--tunas-green);
  color: white;
  border-color: var(--tunas-green);
}

.pill-indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
}

.month-clear {
  background: none;
  border: none;
  color: var(--stone);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Stats bar */
.stats-bar {
  display: flex;
  align-items: center;
  padding: 1.25rem 2.5rem;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--tunas-red);
  line-height: 1;
}

.stat-label {
  color: var(--stone);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: rgba(0, 0, 0, 0.08);
  margin: 0 1.5rem;
}

.highlight .stat-value {
  color: var(--tunas-green);
}

/* Main grid */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  padding: 2rem 2.5rem;
}

/* Timeline cards */
.timeline-container {
  background: transparent;
}

.timeline-track {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.timeline-card {
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.02);
  transition: all 0.3s;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 30px rgba(30, 107, 59, 0.06);
  border-color: rgba(30, 107, 59, 0.1);
}

.local-event {
  border-left: 4px solid var(--tunas-green);
}

.national-event {
  border-left: 4px solid var(--tunas-red);
}

.card-marker {
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1.5rem;
  position: relative;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--tunas-red);
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgba(179, 27, 27, 0.2);
  z-index: 2;
}

.dot-local {
  background: var(--tunas-green);
  box-shadow: 0 0 0 2px rgba(30, 107, 59, 0.2);
}

.marker-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, rgba(0,0,0,0.06), transparent);
  margin-top: 4px;
}

.card-content {
  flex: 1;
  padding: 1.25rem 1.5rem 1.25rem 0.5rem;
}

.card-header-compact {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.event-date {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-feature-settings: 'tnum';
  background: rgba(30, 107, 59, 0.06);
  padding: 0.25rem 0.75rem;
  border-radius: 40px;
  color: var(--tunas-green);
  font-weight: 600;
}

.date-day {
  font-size: 1.2rem;
  font-weight: 700;
}

.date-month {
  font-size: 0.85rem;
  text-transform: uppercase;
}

.date-year {
  font-size: 0.8rem;
  opacity: 0.7;
}

.title-wrapper {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.province-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0,0,0,0.04);
  border-radius: 40px;
  color: var(--stone);
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge-tunas {
  background: var(--tunas-red-soft);
  color: var(--tunas-red);
  font-weight: 600;
}

.event-description {
  color: var(--stone);
  line-height: 1.5;
  margin: 0.75rem 0 1rem 0;
  font-size: 0.95rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag-item {
  background: rgba(0,0,0,0.02);
  padding: 0.25rem 0.7rem;
  border-radius: 40px;
  font-size: 0.8rem;
  color: var(--stone);
  border: 1px solid rgba(0,0,0,0.04);
}

.expand-button {
  background: none;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--stone);
  cursor: pointer;
  transition: all 0.2s;
}

.expand-button:hover {
  background: var(--tunas-green-soft);
  border-color: var(--tunas-green);
  color: var(--tunas-green);
}

.commemorative-seal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(30, 107, 59, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 1px dashed var(--tunas-green);
  opacity: 0.5;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 24px;
}

.empty-illustration {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.reset-button {
  background: var(--tunas-red);
  color: white;
  border: none;
  padding: 0.7rem 1.8rem;
  border-radius: 60px;
  font-weight: 600;
  margin-top: 1.5rem;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(179, 27, 27, 0.2);
}

/* Sidebar */
.archive-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.archive-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(30, 107, 59, 0.06);
}

.archive-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}

.archive-icon {
  font-size: 1.3rem;
}

.archive-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--archival);
}

.highlights {
  background: linear-gradient(145deg, white, #fefaf5);
}

.rotating-highlight {
  min-height: 100px;
  background: rgba(30, 107, 59, 0.02);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.highlight-date {
  font-size: 0.8rem;
  color: var(--tunas-red);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.highlight-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}

.highlight-year {
  margin-top: 0.5rem;
  color: var(--stone);
  font-size: 0.9rem;
}

.highlight-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-arrow {
  background: none;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-counter {
  font-size: 0.85rem;
  color: var(--stone);
}

/* Mini calendario */
.calendar-mini .month-preview {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.calendar-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0,0,0,0.02);
  display: inline-block;
}

.calendar-dot.event-dot {
  background: var(--tunas-green);
  position: relative;
}

.calendar-hint {
  font-size: 0.8rem;
  color: var(--stone);
  margin-left: 0.5rem;
}

/* Province stats */
.province-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.province-bar {
  display: grid;
  grid-template-columns: 100px 40px 1fr;
  align-items: center;
  gap: 0.8rem;
}

.province-name {
  font-weight: 500;
  color: var(--ink);
}

.province-count {
  font-weight: 600;
  color: var(--stone);
}

.bar-bg {
  height: 8px;
  background: rgba(0,0,0,0.06);
  border-radius: 20px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 20px;
}

.bar-fill.tunas {
  background: var(--tunas-green);
}

.bar-fill.national {
  background: var(--tunas-red);
}

/* Tags cloud */
.tags-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.tag-cloud-btn {
  background: none;
  border: none;
  color: var(--tunas-green);
  padding: 0.2rem 0.8rem;
  border-radius: 40px;
  background: rgba(30, 107, 59, 0.04);
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
}

.tag-cloud-btn:hover {
  background: var(--tunas-green);
  color: white;
}

/* Footer */
.museum-footer {
  margin-top: 1.5rem;
  background: #1a1e24;
  color: rgba(255,255,255,0.7);
  position: relative;
}

.footer-wave {
  height: 6px;
  background: repeating-linear-gradient(
    45deg,
    var(--tunas-green) 0px,
    var(--tunas-green) 10px,
    var(--tunas-red) 10px,
    var(--tunas-red) 20px
  );
}

.footer-content {
  padding: 1.5rem 2.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  font-size: 0.9rem;
}

.footer-divider {
  opacity: 0.3;
}

/* Animaciones */
.timeline-enter-from,
.timeline-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.timeline-enter-active,
.timeline-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1100px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .main-title {
    font-size: 2rem;
  }
}

@media (max-width: 700px) {
  .memorial-header,
  .stats-bar,
  .main-grid,
  .footer-content {
    padding: 1.5rem;
  }
  
  .stats-bar {
    flex-wrap: wrap;
  }
  
  .card-header-compact {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .title-wrapper {
    width: 100%;
  }
}
</style>