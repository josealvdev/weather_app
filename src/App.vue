<template>
  <main>
    <MapComponent />
  </main>
</template>

<script setup>
import MapComponent from "./components/MapComponent.vue";
import { onMounted } from 'vue';

import { useCityStore } from '@/stores/city';

const store = useCityStore();
const { setCityWeatherIcon } = store;

onMounted(() => {
  setCityWeatherIcon();
})
</script>