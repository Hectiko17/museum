<template>
  <section class="efemerides-museum" role="region" aria-label="Efemérides Museo Provincial Las Tunas">
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
          <input v-model="q" class="search-input" placeholder="Buscar efeméride, figura histórica, lugar..." />
        </div>

        <div class="filter-group">
          <div class="month-selector">
              <button
                v-for="m in months"
                :key="m.value"
                class="month-pill"
                :class="{ active: selectedMonth === m.value }"
                :aria-pressed="selectedMonth === m.value"
                @click="selectedMonth = selectedMonth === m.value ? 0 : m.value"
              >
                {{ m.name.slice(0,3) }}
                <span v-if="selectedMonth === m.value" class="pill-indicator" aria-hidden="true"></span>
              </button>
            <button v-if="selectedMonth !== 0" class="month-clear" @click="selectedMonth = 0">✕</button>
          </div>
        </div>
      </div>
      
      <div class="hero-preview" aria-hidden="false">
        <div class="hero-overlay">
          <div class="hero-text">
            <h2>Museo Provincial — Colecciones y Exposiciones</h2>
            <p>Explora objetos, documentos y relatos que preservan la memoria tunera.</p>
            <button class="hero-cta">Visitar archivo</button>
          </div>
        </div>
      </div>
    </header>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ totalEfemerides }}</span>
        <span class="stat-label">efemérides</span>
      </div>
      <div class="stat-divider" />
      <div class="stat-item highlight">
        <span class="stat-value">{{ localCount }}</span>
        <span class="stat-label">locales</span>
      </div>
      <div class="stat-divider" />
      <div class="stat-item">
        <span class="stat-value">{{ nationalCount }}</span>
        <span class="stat-label">nacionales</span>
      </div>
    </div>

    <main class="main-grid">
      <section class="timeline-col">
        <div class="collections-grid" aria-label="Colecciones destacadas">
          <article v-for="c in topCollections" :key="c.id" class="collection-card">
            <div class="card-thumb" :style="{ backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.18)), url(\'' + (c.image||'') + '\')' }">
              <div class="card-tag">{{ monthName(c.month) }}</div>
            </div>
            <div class="card-body">
              <h4>{{ c.title }}</h4>
              <p class="card-sub">{{ c.province }} — {{ c.day }}/{{ c.month }}</p>
            </div>
          </article>
        </div>

        <div v-if="currentHighlight.title" class="rotating-highlight timeline-card">
          <div class="highlight-date">{{ monthName(currentHighlight.month) }} {{ currentHighlight.day }}</div>
          <div class="highlight-title">{{ currentHighlight.title }}</div>
          <div class="highlight-actions">
            <button class="expand-button" @click="prevHighlight">◀</button>
            <button class="expand-button" @click="nextHighlight">▶</button>
          </div>
        </div>

        <div class="timeline-list">
          <article 
            v-for="e in filtered" 
            :key="e.id" 
            :class="['timeline-card', isLocal(e) ? 'local-event' : 'national-event']"
          >
            <div class="event-meta">
              <div class="event-date">
                <div class="date-day">{{ e.day }}</div>
                <div class="date-month">{{ monthName(e.month) }}</div>
                <div class="date-year">{{ e.year }}</div>
              </div>
            </div>
            <div class="event-body">
              <h3>{{ e.title }}</h3>
              <p>{{ e.description }}</p>
              <div class="event-footer">
                <span class="province-badge">{{ e.province }}</span>
                <div class="tags">
                  <span v-for="t in e.tags || []" :key="t" class="tag-item">{{ t }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <aside class="sidebar-col">
        <div class="archive-card">
          <div class="archive-header">
            <h3>Archivo</h3>
            <p>Top etiquetas</p>
          </div>
          <div class="tag-cloud">
            <button 
              v-for="t in topTags" 
              :key="t.name" 
              class="tag-cloud-btn"
              :aria-pressed="q === t.name"
              @click="q = t.name"
            >
              {{ t.name }} ({{ t.count }})
            </button>
          </div>
        </div>

        <div class="archive-card highlights">
          <h4>Destacadas — Las Tunas</h4>
          <ol>
            <li v-for="e in localHighlights" :key="e.id">
              {{ monthName(e.month) }} {{ e.day }} — {{ e.title }}
            </li>
          </ol>
        </div>
      </aside>
    </main>

    <footer class="museum-footer">
      <div class="footer-content">Museo Provincial — Datos históricos</div>
    </footer>
  </section>
</template>

<script setup>
import rawData from "../data/efemerides.json";
import { ref, computed, onMounted, watch } from "vue";

// Ensure we use the embedded array from the JSON
const efemerides = (rawData && rawData.efemerides) || [];

// States
const q = ref("");
const selectedMonth = ref(0);
const highlightIndex = ref(0);
const currentHighlight = ref({});

const months = [
  { value: 1, name: "Enero" }, { value: 2, name: "Febrero" }, { value: 3, name: "Marzo" },
  { value: 4, name: "Abril" }, { value: 5, name: "Mayo" }, { value: 6, name: "Junio" },
  { value: 7, name: "Julio" }, { value: 8, name: "Agosto" }, { value: 9, name: "Septiembre" },
  { value: 10, name: "Octubre" }, { value: 11, name: "Noviembre" }, { value: 12, name: "Diciembre" }
];

function monthName(m) { 
  const found = months.find(x => x.value === m); 
  return found ? found.name : ""; 
}

function isLocal(e) { 
  return (e.province || "").toLowerCase() === "las tunas"; 
}

const totalEfemerides = computed(() => efemerides.length);
const localCount = computed(() => efemerides.filter(e => isLocal(e)).length);
const nationalCount = computed(() => efemerides.filter(e => e.province === "Nacional").length);

const localHighlights = computed(() => 
  efemerides
    .filter(e => isLocal(e))
    .sort((a,b) => a.month - b.month || a.day - b.day)
);

const uniqueTags = computed(() => {
  const tags = new Set(); 
  efemerides.forEach(e => e.tags?.forEach(t => tags.add(t))); 
  return Array.from(tags);
});

const topTags = computed(() => {
  const freq = {}; 
  efemerides.forEach(e => e.tags?.forEach(t => freq[t] = (freq[t]||0)+1));
  return Object.entries(freq)
    .map(([name,count]) => ({name,count}))
    .sort((a,b) => b.count - a.count)
    .slice(0,8);
});

const topCollections = computed(() => {
  // Simple heuristic: pick first 6 entries as sample collections / thumbnails
  return efemerides.slice(0,6).map(e => ({
    id: e.id,
    title: e.title,
    month: e.month,
    day: e.day,
    province: e.province,
    image: e.image || ''
  }));
});

const filtered = computed(() => {
  const qv = q.value.trim().toLowerCase();
  return efemerides
    .filter(e => {
      if (!(e.province === "Nacional" || isLocal(e))) return false;
      if (selectedMonth.value && e.month !== selectedMonth.value) return false;
      if (!qv) return true;
      const text = (
        (e.title||"") + " " + 
        (e.description||"") + " " + 
        (e.tags||[]).join(" ")
      ).toLowerCase();
      return text.includes(qv);
    })
    .sort((a,b) => a.month - b.month || a.day - b.day);
});

watch(localHighlights, (highlights) => { 
  if (highlights.length > 0) {
    currentHighlight.value = highlights[0];
    highlightIndex.value = 0;
  }
}, { immediate: true });

function nextHighlight(){ 
  if (localHighlights.value.length === 0) return; 
  highlightIndex.value = (highlightIndex.value + 1) % localHighlights.value.length; 
  currentHighlight.value = localHighlights.value[highlightIndex.value]; 
}

function prevHighlight(){ 
  if (localHighlights.value.length === 0) return; 
  highlightIndex.value = (highlightIndex.value - 1 + localHighlights.value.length) % localHighlights.value.length; 
  currentHighlight.value = localHighlights.value[highlightIndex.value]; 
}

onMounted(() => { 
  console.log('Efemérides component mounted — entries:', efemerides.length); 
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

:root{
  --color-red: #b31b1b;
  --color-green: #1e6b3b;
  --color-parchment: #fcf9f2;
  --surface: #f6f2ee;
  --text: #2b2b2b;
  --radius: 16px;
  --shadow-soft: 0 6px 18px rgba(11,11,11,0.08);
  --shadow-hover: 0 10px 30px rgba(11,11,11,0.12);
  --transition-fast: 0.2s ease;
  --pill-gap: 8px;
}

*{ box-sizing: border-box; }
html,body{ font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:var(--text); }

@keyframes pulseLocal{
  0%{ transform: scale(1); }
  50%{ transform: scale(1.02); }
  100%{ transform: scale(1); }
}
</style>

<style scoped>
.efemerides-museum{
  max-width:1200px;
  margin:28px auto;
  padding:12px;
  background: linear-gradient(180deg,var(--color-parchment), #fff7f3);
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(0,0,0,0.04);
}

/* Mobile-first: stack */
.memorial-header{
  display:flex;
  flex-direction:column;
  gap:16px;
  padding:18px;
  background: linear-gradient(90deg, rgba(30,107,59,0.03), rgba(179,27,27,0.02));
  border-bottom: 1px solid rgba(30,107,59,0.06);
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
}

.header-badge{ display:flex; gap:12px; align-items:center }
.badge-tunas{ font-weight:800; padding:8px 14px; border-radius: var(--radius); color:white; background: linear-gradient(90deg,var(--color-red), #8b1a1a); box-shadow: 0 6px 18px rgba(179,27,27,0.12); font-size:0.85rem }
.badge-year{ font-weight:700; color:var(--color-green); background: rgba(30,107,59,0.06); padding:7px 12px; border-radius: var(--radius); font-size:0.85rem }

.title-block{ margin-top:4px }
.main-title{ margin:0; font-size:28px; line-height:1; font-weight:700; letter-spacing:-0.5px; color:var(--text) }
.main-title .accent{ color:var(--color-red); margin-left:6px }
.subtitle{ margin:8px 0 0 0; color:#555; font-size:13px }

.search-panel{ display:flex; gap:12px; align-items:center; flex-wrap:wrap }
.input-group{ display:flex; align-items:center; gap:10px; background:var(--surface); padding:8px 12px; border-radius:999px; box-shadow: 0 6px 18px rgba(16,20,12,0.04); border:1px solid rgba(0,0,0,0.04) }
.input-icon{ color:#7a7a7a }
.search-input{ border:0; outline:none; min-width:180px; font-size:14px; background:transparent }

.month-selector{ display:flex; gap:8px; align-items:center; flex-wrap:wrap }
.month-pill{ padding:6px 12px; border-radius:999px; background:transparent; color:#666; border:1px solid rgba(30,107,59,0.06); cursor:pointer; font-weight:600; transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast) }
.month-pill:hover, .month-pill:focus{ transform: translateY(-2px); }
.month-pill.active{ background: var(--color-red); color:var(--color-parchment); box-shadow: var(--shadow-soft) }
.month-clear{ background:transparent; border:0; color:#666; cursor:pointer }

.stats-bar{ display:flex; gap:12px; align-items:center; padding:12px; border-bottom:1px solid rgba(0,0,0,0.04); background: linear-gradient(90deg, rgba(179,27,27,0.01), rgba(30,107,59,0.01)); overflow:auto }
.stat-item{ display:flex; flex-direction:column; padding:8px 12px }
.stat-value{ font-weight:800; color:var(--color-red); font-size:20px }
.stat-label{ font-size:12px; color:#666 }
.stat-divider{ width:1px; background:linear-gradient(180deg,var(--color-red),var(--color-green)); height:36px; opacity:0.14 }

.main-grid{ display:block; padding:18px; gap:18px }

.timeline-list{ display:flex; flex-direction:column; gap:14px }
.timeline-card{ display:flex; gap:16px; align-items:flex-start; padding:16px; background:var(--surface); border-radius: calc(var(--radius) - 4px); border:1px solid rgba(0,0,0,0.04); box-shadow: 0 8px 20px rgba(10,12,8,0.03); transition: transform var(--transition-fast), box-shadow var(--transition-fast); border-left:6px solid var(--color-red) }
.timeline-card:hover{ transform: translateY(-2px); box-shadow: var(--shadow-hover) }
.timeline-card.local-event{ border-left-color: var(--color-red) }
.timeline-card.national-event{ border-left-color: var(--color-green) }

.event-date{ width:76px; text-align:center; padding:10px; border-radius:10px; font-weight:800; background: linear-gradient(180deg, rgba(30,107,59,0.03), rgba(179,27,27,0.01)); color:var(--color-green) }
.date-day{ font-size:18px; color:var(--color-red); margin-bottom:4px }

.event-body h3{ margin:0 0 6px 0; font-size:16px }
.event-body p{ margin:0 0 8px 0; color:#666 }
.province-badge{ padding:6px 10px; border-radius:999px; background:rgba(0,0,0,0.03); color:#666; font-size:12px }
.tags{ display:flex; gap:8px; flex-wrap:wrap }
.tag-item{ background:linear-gradient(90deg, rgba(30,107,59,0.03), rgba(179,27,27,0.01)); color:var(--color-green); padding:6px 10px; border-radius:999px; font-size:12px }

.sidebar-col{ display:flex; flex-direction:column; gap:12px; margin-top:18px }
.archive-card{ padding:14px; border-radius:12px; background:linear-gradient(180deg,#fff,#fffaf7); border:1px solid rgba(0,0,0,0.04) }
.archive-header h3{ margin:0 0 6px 0 }
.tag-cloud{ display:flex; gap:8px; flex-wrap:wrap }
.tag-cloud-btn{ padding:6px 10px; border-radius:999px; background:transparent; border:1px solid rgba(30,107,59,0.06); color:#666; cursor:pointer; transition: transform var(--transition-fast) }
.tag-cloud-btn:hover{ transform: translateY(-2px); }

.rotating-highlight{ padding:14px; border-radius:12px; background: linear-gradient(90deg, rgba(30,107,59,0.03), rgba(179,27,27,0.02)); border: 1px solid rgba(0,0,0,0.03) }
.highlight-date{ font-weight:800; color:var(--color-red); margin-bottom:6px }
.highlight-title{ font-weight:800; color:var(--color-green) }
.highlight-actions{ margin-top:8px; display:flex; gap:8px }
.expand-button{ padding:6px 10px; border-radius:8px; border:1px solid rgba(0,0,0,0.06); background:white; cursor:pointer }

.museum-footer{ padding:14px; background: linear-gradient(135deg,var(--color-red),var(--color-green)); color:white; border-radius:0 0 var(--radius) var(--radius); margin-top:18px }

/* Desktop layout */
@media (min-width: 920px){
  .memorial-header{ flex-direction:row; align-items:center; justify-content:space-between; padding:28px 32px }
  .main-grid{ display:grid; grid-template-columns: 1fr 320px; gap:28px; padding:24px 32px }
  .search-input{ min-width:300px }
}

/* Hero preview */
.hero-preview{ width:100%; border-radius:12px; overflow:hidden; margin-top:8px; height:140px; background: linear-gradient(135deg, rgba(179,27,27,0.9), rgba(30,107,59,0.85)); color:white; display:flex; align-items:center }
.hero-overlay{ width:100%; padding:16px; display:flex; align-items:center }
.hero-text h2{ margin:0; font-size:18px; font-weight:700 }
.hero-text p{ margin:6px 0 0 0; font-size:13px; opacity:0.95 }
.hero-cta{ margin-top:8px; padding:8px 14px; border-radius:999px; border:0; background:var(--color-parchment); color:var(--text); cursor:pointer; font-weight:700 }

/* Collections grid */
.collections-grid{ display:grid; grid-template-columns: repeat(2,1fr); gap:12px; margin-bottom:12px }
.collection-card{ background: white; border-radius:12px; overflow:hidden; box-shadow: 0 8px 20px rgba(10,12,8,0.04); transition: transform var(--transition-fast), box-shadow var(--transition-fast) }
.collection-card:hover{ transform: translateY(-4px); box-shadow: var(--shadow-hover) }
.card-thumb{ height:96px; background-size:cover; background-position:center; display:flex; align-items:flex-start; justify-content:flex-end; padding:8px }
.card-tag{ background:rgba(255,255,255,0.9); color:var(--text); padding:4px 8px; border-radius:999px; font-weight:700; font-size:12px }
.card-body{ padding:10px }
.card-body h4{ margin:0 0 6px 0; font-size:14px }
.card-sub{ margin:0; font-size:12px; color:#666 }

@media (min-width:640px){
  .collections-grid{ grid-template-columns: repeat(3,1fr) }
}


</style>
