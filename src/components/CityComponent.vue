<template>
        <div class="modal-overlay">
            <div class="modal-city">
                <div class="row mb-4">
                    <div class="col-11">
                        <span style="font-size: 28px;margin-right: 8px;"><b>{{ cityObject.city }}</b></span>
                        <span>({{ cityObject.admin_name }})</span>
                    </div>
                    <button class="col-1 btn btn-secondary" @click="emit('close')">&times;</button>
                </div>
                <div class="days-container">
                    <div v-for="day in days">
                        <div class="card">
                            <div class="card-body">
                                <span class="card-title">{{ day.day }}</span>
                                <img class="card-img-top" :src="day.weather_img" alt="Card image cap">
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted  } from 'vue';
import axios from 'axios';

import wmo_codes from "./../assets/wmo.json";

const props = defineProps(['cityObject']);
const emit = defineEmits(['close']);

const days = ref([]);

onMounted(() => {
    //https://api.open-meteo.com/v1/forecast?latitude=37.8916&longitude=-4.7728&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum
    axios
      .get('https://api.open-meteo.com/v1/forecast?latitude='+props.cityObject.lat+'&longitude='+props.cityObject.lng+'&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum')
      .then(response => {
        setData(response.data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => /*this.loading = false*/ console.log("finally"));
})

function setData(data) {
    console.log(data);
    for (let i = 0; i < data.daily.time.length; i++) {
        let weather_icon = getWeatherIcon(data.daily.weather_code[i]);
        let dayObject = {
            day: data.daily.time[i],
            weather_img: weather_icon,
            temperature_max: data.daily.temperature_2m_max[i],
            temperature_min: data.daily.temperature_2m_min[i],
            precipitation_sum_percent: data.daily.precipitation_sum[i]
        }
        days.value.push(dayObject);
    }
    console.log(days.value);
};

function getWeatherIcon(weather_code) {
    return wmo_codes[weather_code].day.image;
}
</script>

<style scoped>
.days-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Tres columnas */
  gap: 20px; /* Espaciado entre las tarjetas */
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 950px) {
  .days-container {
    grid-template-columns: repeat(2, 1fr); /* Dos columnas para pantallas más pequeñas */
  }
}

@media (max-width: 480px) {
  .days-container {
    grid-template-columns: 1fr; /* Una columna para pantallas muy pequeñas */
  }
}
</style>