<template>
     <l-map ref="map" v-model:zoom="zoom" v-model:center="center" v-model:maxBounds="maxBounds" :useGlobalLeaflet="false">
          <l-tile-layer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
               layer-type="base"
               name="Stadia Maps Basemap">
          </l-tile-layer>
          <l-marker v-for="(city, index) in cities" :key="index" :lat-lng="[city.lat,city.lng]">
               <l-icon
                    :icon-size="[52, 50]"
                    :icon-anchor="[24, 10]"
                    :iconUrl="citiesWeatherIcon[index]">
               </l-icon>
               <l-popup><b style="font-size: 15px;">{{city.city}}</b><br>({{ city.admin_name }})<br><br><span class="open" @click="openModal(city)">Ver</span></l-popup>
          </l-marker>
     </l-map>
     <CityComponent v-if="isModalVisible" :cityObject="cityObject" @close="closeModal()" />
     <SearchComponent @openm="openModal"/>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "@vue-leaflet/vue-leaflet";

import { ref } from 'vue';
import CityComponent from "./CityComponent.vue";
import SearchComponent from "./SearchComponent.vue";

import cities from "./../assets/db/es.json";
//import cityIcon from "./../assets/img/city.png";

import { useCityStore } from '@/stores/city';
const store = useCityStore();
const { citiesWeatherIcon } = store;

let zoom = 5;
let center = [40, -5];
let maxBounds = [[50, -20], [10, 10]];
const isModalVisible = ref(false);
const cityObject = ref({});

const openModal = (city) => {
     isModalVisible.value = true;
     cityObject.value = city;
}

const closeModal = () => {
     isModalVisible.value = false;
     cityObject.value = {};
}
</script>