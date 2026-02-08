<template>
  <section class="efemerides">
    <div class="debug-banner">EFEMERIDES COMPONENT LOADED</div>
    <h2>Efemérides de Cuba</h2>
    <div class="container">
      <div class="months">
        <div v-for="m in months" :key="m.value" class="month">
          <button class="month-toggle" @click="toggle(m.value)">
            {{ m.name }}
          </button>
          <ul v-show="openMonth === m.value">
            <li
              v-for="e in eventsByMonth(m.value)"
              :key="e.title + e.day"
              :class="{ local: isLocal(e) }"
            >
              <strong>{{ e.day }} — {{ e.title }}</strong>
              <div class="desc">{{ e.description }}</div>
              <div class="loc">{{ e.location }}</div>
            </li>
            <li v-if="eventsByMonth(m.value).length === 0" class="none">
              No hay efemérides registradas.
            </li>
          </ul>
        </div>
      </div>
      <aside class="highlight">
        <h3>Destacadas — Las Tunas</h3>
        <ul>
          <li v-for="e in localHighlights" :key="e.title + e.day">
            <strong>{{ monthName(e.month) }} {{ e.day }}:</strong> {{ e.title }}
            <div class="desc">{{ e.description }}</div>
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
import { ref, computed } from "vue";
import { onMounted } from "vue";

onMounted(() => {
  console.log("Efemerides component mounted, events:", efemerides.length);
});

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

const openMonth = ref(null);
function toggle(m) {
  openMonth.value = openMonth.value === m ? null : m;
}

function eventsByMonth(m) {
  return efemerides.filter((e) => e.month === m).sort((a, b) => a.day - b.day);
}

function monthName(m) {
  const found = months.find((x) => x.value === m);
  return found ? found.name : "";
}

function isLocal(e) {
  return (e.location || "").toLowerCase() === "las tunas";
}

const localHighlights = computed(() =>
  efemerides
    .filter((e) => isLocal(e))
    .sort((a, b) => a.month - b.month || a.day - b.day)
);
</script>

<style scoped>
.efemerides {
  padding: 1rem;
}
.container {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.months {
  flex: 2;
}
.month {
  margin-bottom: 0.5rem;
}
.month-toggle {
  background: #f3f3f3;
  border: 1px solid #ddd;
  padding: 0.4rem 0.6rem;
  width: 100%;
  text-align: left;
}
ul {
  list-style: none;
  margin: 0.5rem 0 1rem 0;
  padding: 0;
}
li {
  padding: 0.4rem;
  border-bottom: 1px solid #eee;
}
li.local {
  background: #fff7e6;
  border-left: 4px solid #ffb74d;
}
.highlight {
  flex: 1;
  background: #fafafa;
  padding: 0.6rem;
  border: 1px solid #eee;
}
.desc {
  font-size: 0.9rem;
  color: #555;
}
.loc {
  font-size: 0.8rem;
  color: #888;
}
.none {
  color: #666;
  font-style: italic;
}
</style>
