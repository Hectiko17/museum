<template>
  <section class="efemerides museum">
    <header class="hero">
      <div class="hero-left">
        <h1 class="museum-title">Museo Local — Efemérides</h1>
        <p class="hero-sub">Cronología nacional con énfasis en Las Tunas</p>
      </div>
      <div class="hero-controls">
        <input
          v-model="q"
          class="search"
          placeholder="Buscar (título, descripción, etiqueta)"
        />
        <select v-model.number="selectedMonth" class="month-select">
          <option :value="0">Mes (Todos)</option>
          <option v-for="m in months" :key="m.value" :value="m.value">
            {{ m.name }}
          </option>
        </select>
      </div>
    </header>

    <main class="content">
      <transition-group name="list" tag="div" class="cards">
        <article
          v-for="e in filtered"
          :key="e.title + e.month + e.day"
          class="card"
          :class="{ local: isLocal(e) }"
        >
          <div class="card-date">
            <div class="day">{{ e.day }}</div>
            <div class="month">{{ monthName(e.month) }}</div>
            <div class="year">{{ e.year || "" }}</div>
          </div>
          <div class="card-main">
            <div class="card-header">
              <h3>{{ e.title }}</h3>
              <div class="chip" :class="isLocal(e) ? 'chip-local' : 'chip-nat'">
                {{ isLocal(e) ? "Las Tunas" : "Nacional" }}
              </div>
            </div>
            <p class="desc">{{ e.description }}</p>
            <div class="meta-row">
              <div class="tags">
                <span v-for="t in e.tags || []" :key="t" class="tag">{{
                  t
                }}</span>
              </div>
              <div class="more" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </article>
      </transition-group>

      <aside class="sidebar">
        <div class="side-card">
          <h4>Destacadas — Las Tunas</h4>
          <ol>
            <li v-for="e in localHighlights" :key="e.title + e.day">
              {{ monthName(e.month) }} {{ e.day }} — {{ e.title }}
            </li>
          </ol>
        </div>
      </aside>
    </main>
  </section>
</template>

<script setup>
import efemerides from "../data/efemerides.json";
import { ref, computed, onMounted } from "vue";

const q = ref("");
const selectedMonth = ref(0);

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

function monthName(m) {
  const found = months.find((x) => x.value === m);
  return found ? found.name : "";
}

function isLocal(e) {
  return (e.province || "").toLowerCase() === "las tunas";
}

const localHighlights = computed(() =>
  efemerides
    .filter((e) => isLocal(e))
    .sort((a, b) => a.month - b.month || a.day - b.day)
);

const filtered = computed(() => {
  const qv = q.value.trim().toLowerCase();
  return efemerides
    .filter((e) => {
      // only national or local
      if (!(e.province === "Nacional" || isLocal(e))) return false;
      if (selectedMonth.value && e.month !== selectedMonth.value) return false;
      if (!qv) return true;
      const text = (
        (e.title || "") +
        " " +
        (e.description || "") +
        " " +
        (e.tags || []).join(" ")
      ).toLowerCase();
      return text.includes(qv);
    })
    .sort((a, b) => a.month - b.month || a.day - b.day);
});

onMounted(() => {
  console.log("Efemerides mounted — total entries:", efemerides.length);
});
</script>

<style scoped>
:root {
  --bg: #f7f1ee; /* warm parchment */
  --card: #fffdf9;
  --accent: #3a1f78; /* royal purple */
  --accent-2: #184e8b; /* royal blue accent */
  --gold: #d4b24a; /* richer gold */
  --muted: #594f4a;
  --maroon: #6b2330;
}
.museum {
  background: linear-gradient(180deg, #fff9f0 0%, #f2eefc 100%);
  padding: 1.4rem;
  border-radius: 14px;
  border: 1px solid rgba(58, 22, 83, 0.06);
}
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem;
  background: linear-gradient(
    90deg,
    rgba(58, 31, 120, 0.06),
    rgba(212, 178, 74, 0.04)
  );
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(58, 22, 83, 0.06);
}
.museum-title {
  margin: 0;
  color: var(--accent);
  font-weight: 800;
  letter-spacing: 1px;
  font-family: "Georgia", serif;
}
.hero-sub {
  margin: 0;
  color: var(--maroon);
  font-style: italic;
}
.hero-controls {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}
.search {
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  border: 1px solid rgba(58, 31, 120, 0.08);
  min-width: 260px;
  background: linear-gradient(180deg, #fff, #fffaf3);
}
.month-select {
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid rgba(58, 31, 120, 0.08);
  background: #fffdf9;
}

.content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1rem;
  margin-top: 1rem;
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.card {
  display: flex;
  gap: 1rem;
  background: linear-gradient(180deg, var(--card), #fffaf6);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 10px 36px rgba(58, 22, 83, 0.06);
  align-items: flex-start;
  border: 1px solid rgba(58, 22, 83, 0.04);
  transition: transform 0.16s cubic-bezier(0.2, 0.9, 0.3, 1),
    box-shadow 0.16s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 26px 60px rgba(58, 22, 83, 0.12);
}
.card.local {
  border-left: 6px solid var(--gold);
  box-shadow: 0 12px 30px rgba(212, 178, 74, 0.06);
}
.card-date {
  width: 104px;
  text-align: center;
  color: var(--accent-2);
  font-weight: 700;
}
.card-date .day {
  font-size: 1.8rem;
  font-weight: 800;
}
.card-date .month {
  font-size: 0.9rem;
  color: var(--muted);
}
.card-date .year {
  font-size: 0.85rem;
  color: var(--muted);
  margin-top: 6px;
}
.card-main {
  flex: 1;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.6rem;
}
.chip {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  color: #fff;
}
.chip-local {
  background: linear-gradient(90deg, var(--gold), #e6c86a);
  color: #2b1f00;
  box-shadow: 0 4px 12px rgba(212, 178, 74, 0.12);
}
.chip-nat {
  background: linear-gradient(90deg, var(--accent-2), var(--accent));
  box-shadow: 0 6px 18px rgba(27, 59, 95, 0.08);
}
.desc {
  color: #333;
  margin: 0.5rem 0;
}
.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
}
.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.tag {
  background: linear-gradient(
    90deg,
    rgba(58, 31, 120, 0.06),
    rgba(26, 70, 120, 0.03)
  );
  color: var(--accent-2);
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  font-size: 0.82rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.side-card {
  background: var(--card);
  padding: 0.8rem;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(27, 59, 95, 0.03);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.26s cubic-bezier(0.2, 0.9, 0.3, 1);
}

@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }
  .hero-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .search {
    min-width: unset;
  }
}
</style>
