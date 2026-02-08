<template>
  <section class="efemerides">
    <div class="header">
      <h2>Efemérides de Cuba</h2>
      <div class="controls">
        <input
          v-model="q"
          placeholder="Buscar efemérides (título, descripción, etiqueta)"
        />
        <select v-model.number="selectedMonth">
          <option :value="0">Todos los meses</option>
          <option v-for="m in months" :key="m.value" :value="m.value">
            {{ m.name }}
          </option>
        </select>
        <select v-model="selectedProvince">
          <option value="">Todas las provincias</option>
          <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
    </div>

    <div class="grid">
      <div class="list">
        <div v-if="filtered.length === 0" class="none">
          No se encontraron efemérides.
        </div>
        <article
          v-for="e in filtered"
          :key="e.title + e.month + e.day"
          class="card"
          :class="{ local: isLocal(e) }"
        >
          <div class="card-left">
            <div class="date">
              {{ e.day }}<span>/{{ e.month }}</span>
            </div>
            <div class="year">{{ e.year || "" }}</div>
          </div>
          <div class="card-body">
            <h3>{{ e.title }}</h3>
            <div class="meta">
              {{ e.province || "—" }} •
              <span class="tags">{{ (e.tags || []).join(", ") }}</span>
            </div>
            <p class="desc">{{ e.description }}</p>
          </div>
        </article>
      </div>
      <aside class="sidebar">
        <h4>Destacadas — Las Tunas</h4>
        <ul>
          <li v-for="e in localHighlights" :key="e.title + e.day">
            {{ monthName(e.month) }} {{ e.day }} — {{ e.title }}
          </li>
          <li v-if="localHighlights.length === 0">
            No hay efemérides locales en los datos.
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script setup>
import efemerides from "../data/efemerides.json";
import { ref, computed, onMounted } from "vue";

const q = ref("");
const selectedMonth = ref(0);
const selectedProvince = ref("");

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

const provinces = Array.from(
  new Set(efemerides.map((e) => e.province).filter(Boolean))
).sort();

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
  return efemerides
    .filter((e) => {
      if (selectedMonth.value && e.month !== selectedMonth.value) return false;
      if (selectedProvince.value && e.province !== selectedProvince.value)
        return false;
      const text = (
        e.title +
        " " +
        (e.description || "") +
        " " +
        (e.tags || []).join(" ")
      ).toLowerCase();
      if (q.value && !text.includes(q.value.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => a.month - b.month || a.day - b.day);
});

onMounted(() => {
  console.log("Efemerides component mounted, events:", efemerides.length);
});
</script>

<style scoped>
.efemerides {
  padding: 1rem;
  font-family: system-ui, Arial, sans-serif;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.controls input {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.controls select {
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.grid {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.list {
  flex: 3;
}
.sidebar {
  flex: 1;
  background: #fafafa;
  padding: 0.6rem;
  border: 1px solid #eee;
}
.card {
  display: flex;
  gap: 0.8rem;
  padding: 0.6rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  background: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}
.card.local {
  border-left: 4px solid #ffb74d;
  background: #fff7e6;
}
.card-left {
  width: 64px;
  text-align: center;
  font-weight: 700;
}
.date {
  font-size: 1.2rem;
}
.date span {
  font-weight: 400;
  color: #666;
  margin-left: 4px;
}
.year {
  font-size: 0.85rem;
  color: #777;
}
.card-body h3 {
  margin: 0 0 4px 0;
}
.meta {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 6px;
}
.desc {
  margin: 0;
  color: #444;
}
.none {
  color: #666;
  font-style: italic;
}
</style>
