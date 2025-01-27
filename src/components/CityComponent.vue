<template>
        <div class="modal-overlay">
            <div class="modal-city">
                <div class="mb-4">
                    <div class="upperMenu">
                        <div class="divName">
                          <span class="cityName"><b>{{ cityObject.city }}</b></span>
                          <span>({{ cityObject.admin_name }})</span>
                        </div>
                        <div class="divClose">
                          <span class="closeb btn btn-secondary" @click="emit('close')">&times;</span>
                        </div>
                    </div>
                </div>
                <div class="days-container">
                    <div v-for="day in days">
                        <div class="card" style="border: 0;">
                            <div class="card-body text-center">
                                <span class="dayDate card-title fw-bold">{{ day.day }}</span><br>
                                <img class="card-img-top" :src="day.weather_img" alt="Card image cap"><br>
                                <span class="card-text"><span class="text-danger" style="font-weight: 600;">{{ day.temperature_max }}°</span> <span class="text-primary" style="font-weight: 600;">{{ day.temperature_min }}°</span></span><br>
                                <span class="text-info" style="font-weight: 600;">{{ day.precipitation_sum_percent }}% <img :src="dropIcon" style="width: 12px;"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
</template>

<script setup>
import { ref, onMounted  } from 'vue';
import axios from 'axios';

import { getWeatherIcon } from './../utils/wmo.js';
import dropIcon from "./../assets/img/drop.png";

const props = defineProps(['cityObject']);
const emit = defineEmits(['close']);

const days = ref([]);

onMounted(() => {
    getData();
})

async function getData() {
    await axios
      .get('https://api.open-meteo.com/v1/forecast?latitude='+props.cityObject.lat+'&longitude='+props.cityObject.lng+'&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum')
      .then(response => {
        setData(response.data)
      })
      .catch(error => {
        console.log(error)
      });
}

function setData(data) {
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
};
</script>