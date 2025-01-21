<template>
     <l-map ref="map" v-model:zoom="zoom" v-model:center="center" v-model:maxBounds="maxBounds" :useGlobalLeaflet="false">
          <l-tile-layer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
               layer-type="base"
               name="Stadia Maps Basemap">
          </l-tile-layer>
          <l-marker v-for="city in cities" :lat-lng="[city.lat,city.lng]">
               <l-icon
                    :icon-size="[32, 37]"
                    :icon-anchor="[10, 10]"
                    :icon-url="cityIcon" >
               </l-icon>
               <l-popup><b style="font-size: 15px;">{{city.city}}</b><br>({{ city.admin_name }})<br><p class="open" @click="openModal(city)">Ver</p></l-popup>
          </l-marker>
     </l-map>
     <CityComponent v-if="isModalVisible" :cityObject="cityObject" @close="closeModal()" />
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "@vue-leaflet/vue-leaflet";

import { ref } from 'vue';
import CityComponent from "./CityComponent.vue";

import cities from "./../assets/es.json";
import cityIcon from "./../assets/img/city.png";

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