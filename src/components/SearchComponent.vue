<template>
    <div class="search-box">
        <button class="btn-search"><img :src="searchIcon" class="fas fa-search"></img></button>
        <input type="text" v-model="search" class="input-search" placeholder="Busca tu ciudad...">
        <div v-if="search.length > 0" class="search-results">
            <ul>
                <li v-for="city in results" @click="emit('openm', city)">{{ city.city }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

import cities from "./../assets/db/es.json";

import searchIcon from "./../assets/img/search-solid.svg";

const emit = defineEmits(['openm']);
let search = ref('');
let results = ref([]);

watch(search, (value) => {
    results.value = [];
    if (value.length > 0) {
        for (var i=0 ; i < cities.length ; i++) {
            let lower = value.toLowerCase();
            if (cities[i].city.toLowerCase().includes(lower)) {
                results.value.push(cities[i]);
            }
        }
    }
});
</script>