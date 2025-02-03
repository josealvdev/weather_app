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
                <div class="day-data">
                    <div class="day-content">
                        <DataTable :value="days" size="small" stripedRows style="min-width: 50rem;max-height: 300px;">
                            <Column field="day" header="Fecha" style="width: 8%;font-weight: 600;"></Column>
                            <Column header="Tiempo" style="width: 5%">
                                <template #body="props">
                                    <img :src="props.data.weather_img" style="width: 50px;"/>
                                </template>
                            </Column>
                            <Column field="temperature" header="Temperatura Max/Min" style="width: 10%">
                                <template #body="props">
                                    <span class="text-danger" style="font-weight: 600;">{{ props.data.temperature_max }}°</span> / <span class="text-primary" style="font-weight: 600;">{{ props.data.temperature_min }}°</span>
                                </template>
                            </Column>
                            <Column field="precipitation_sum_percent" header="% Precipitación" style="width: 10%">
                                <template #body="props">
                                    <span class="text-info" style="font-weight: 600;">{{ props.data.precipitation_sum_percent }}% <img :src="dropIcon" style="width: 12px;"></span>
                                </template>
                            </Column>
                            <Column field="wind_speed" header="Velocidad del viento" style="width: 15%">
                                <template #body="props">
                                    <span style="font-weight: 600;">{{ props.data.wind_speed }} Km/h <img :src="windIcon" style="width: 12px;"></span>
                                </template>
                            </Column>
                            <Column field="daylight_duration" header="Horas de luz" style="width: 8%;font-weight: 600;"></Column>
                            <Column field="sunrise" header="H. Amanecer" style="width: 8%;font-weight: 600;"></Column>
                            <Column field="sunset" header="H. Anochecer" style="width: 8%;font-weight: 600;"></Column>
                        </DataTable>
                    </div>
                </div>
            </div> 
        </div>
</template>

<script setup>
import { ref, onMounted  } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { getWeatherIcon } from './../utils/wmo.js';
import dropIcon from "./../assets/img/drop.png";
import windIcon from "./../assets/img/wind.png";

const props = defineProps(['cityObject']);
const emit = defineEmits(['close']);

const days = ref([]);

onMounted(() => {
    getData();
})

async function getData() {
    await axios
      .get('https://api.open-meteo.com/v1/forecast?latitude='+props.cityObject.lat+'&longitude='+props.cityObject.lng+'&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,daylight_duration,wind_speed_10m_max')
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

        let hours = Math.floor(data.daily.daylight_duration[i] / 3600);
        let minutes = Math.floor((data.daily.daylight_duration[i] % 3600) / 60);

        let sunriseF = data.daily.sunrise[i].split('T')[1];
        let sunsetF = data.daily.sunset[i].split('T')[1];

        let dayObject = {
            day: data.daily.time[i],
            weather_img: weather_icon,
            temperature_max: data.daily.temperature_2m_max[i],
            temperature_min: data.daily.temperature_2m_min[i],
            precipitation_sum_percent: data.daily.precipitation_sum[i],
            sunrise: sunriseF,
            sunset: sunsetF,
            daylight_duration: hours + 'h ' + minutes + 'm',
            wind_speed: data.daily.wind_speed_10m_max[i]
        }
        days.value.push(dayObject);
    }
};
</script>

<style scoped>
.day-content {
    overflow-y: scroll;
    padding-right: 10px;
}

.day-content::-webkit-scrollbar {
    width: 1em;
}
 
.day-content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
 
.day-content::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
</style>