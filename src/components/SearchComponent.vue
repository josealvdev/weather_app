<template>
    <div class="search-box">
        <button class="btn-search"><img :src="searchIcon" class="fas fa-search"></img></button>
        <input type="text" v-model="search" class="input-search" placeholder="Busca tu ciudad...">
        <div v-if="search.length > 0" class="search-results">
            <ul>
                <li v-for="city in results" :key="city.id">{{ city.city }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

import cities from "./../assets/es.json";

import searchIcon from "./../assets/img/search-solid.svg";

let search = ref('');
let results = ref([]);

watch(search, (value) => {
    results.value = [];
    for (var i=0 ; i < cities.length ; i++) {
        if (cities[i].city.includes(value)) {
            results.value.push(cities[i]);
        }
    }
});
</script>