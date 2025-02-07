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
                    <div v-if="loading" style="text-align: center;">
                        <ProgressSpinner />
                        <h3>Cargando...</h3>
                    </div>
                    
                    <div class="day-content" v-else>
                        <h4 class="mt-1 mb-4">Clima de está semana</h4>

                        <DataTable v-if="windowWidth > 600" :value="days" size="small" style="min-width: 50rem;max-height: 650px;">
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

                        <table v-else class="tableMobile" style="min-width: 17rem;border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Tiempo</th>
                                    <th>Exp.</th>
                                </tr>
                            </thead>
                            <tbody v-for="(day, index) in days" :key="index" style="border-bottom: 1px solid black;">
                                <tr style="border-top: 1px solid black;">
                                    <td>{{ day.day }}</td>
                                    <td><img :src="day.weather_img" style="width: 50px;"/></td>
                                    <td><button type="button" class="btn btn-dark" @click="toggleStyle(index)">+</button></td>
                                </tr>
                                <tr :class="{'style-activo': day.view, 'style-inactivo': !day.view}" >
                                    <td><span class="text-danger" style="font-weight: 600;">{{ day.temperature_max }}°</span><img :src="maxTempIcon" style="width: 14px;"> / <span class="text-primary" style="font-weight: 600;">{{ day.temperature_min }}°</span><img :src="minTempIcon" style="width: 14px;"></td>
                                    <td><span class="text-info" style="font-weight: 600;">{{ day.precipitation_sum_percent }}% <img :src="dropIcon" style="width: 14px;"></span></td>
                                    <td><span style="font-weight: bolder;">{{ day.wind_speed }} <span style="font-size: 12px;">Km/h</span> <img :src="windIcon" style="width: 14px;"></span></td>
                                </tr>
                                <tr :class="{'style-activo': day.view, 'style-inactivo': !day.view}" style="border-bottom: 1px solid black;">
                                    <td><b>{{ day.daylight_duration }}</b> <img :src="sunTimeIcon" style="width: 14px;"></td>
                                    <td><b>{{ day.sunrise }}</b> <img :src="sunRiseIcon" style="width: 14px;"></td>
                                    <td><b>{{ day.sunset }}</b> <img :src="sunSetIcon" style="width: 14px;"></td>
                                </tr>
                            </tbody>
                        </table>

                        <h4 class="mt-4 mb-4">% Precipitación de está semana</h4>
                        <Chart type="line" :data="chartData" :options="chartOptions" style="height: 10rem;" />
                    </div>
                </div>
            </div> 
        </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Chart from 'primevue/chart';
import Column from 'primevue/column';

import { getWeatherIcon } from './../utils/wmo.js';
import maxTempIcon from "./../assets/img/thermometer.png";
import minTempIcon from "./../assets/img/low-temperature.png";
import dropIcon from "./../assets/img/drop.png";
import windIcon from "./../assets/img/wind.png";
import sunTimeIcon from "./../assets/img/suntime.png";
import sunRiseIcon from "./../assets/img/sunrise.png";
import sunSetIcon from "./../assets/img/sunset.png";

const props = defineProps(['cityObject']);
const emit = defineEmits(['close']);
const loading = ref(true);

const days = ref([]);
const chartData = ref(
    {
        'labels':[],
        datasets: [
            {
                label: '% Precipitación',
                data: [],
                fill: false,
                borderColor: '#36A2EB',
                tension: 0.4
            }
        ]
    }
);
const chartOptions = ref();
const windowWidth = ref(window.innerWidth);

const handleResize = () => {
    windowWidth.value = window.innerWidth;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    getData();
    chartOptions.value = setChartOptions();
});

onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
});

async function getData() {
    await axios
        .get('https://api.open-meteo.com/v1/forecast?latitude='+props.cityObject.lat+'&longitude='+props.cityObject.lng+'&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,daylight_duration,wind_speed_10m_max')
        .then(response => {
            setData(response.data);
        }).finally(() => {
            loading.value = false;
        })
        .catch(error => {
            console.log(error)
        });
}

function setData(data) {
    let weekday = new Array('Dom.', 'Lun.', 'Mart.', 'Miér.', 'Jue.', 'Vie.', 'Sáb.');
    for (let i = 0; i < data.daily.time.length; i++) {
        let weather_icon = getWeatherIcon(data.daily.weather_code[i]);

        let date = new Date(data.daily.time[i]);
        chartData.value.labels.push(weekday[date.getDay()]);
        chartData.value.datasets[0].data.push(data.daily.precipitation_sum[i]);

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
            wind_speed: data.daily.wind_speed_10m_max[i],
            view: false
        }
        days.value.push(dayObject);
    }
};

function toggleStyle(index) {
    days.value[index].view = !days.value[index].view;
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}
</script>

<style scoped>
.day-content {
    overflow-y: scroll;
    padding-right: 10px;
    max-height: 350px;
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

.tableMobile {
    text-align: center;
}

.style-activo {
    display: table-row;
    background-color: rgb(230, 230, 230);
    padding: 4px 0px 4px 0px;
    border: 1px solid rgb(230, 230, 230);
}

.style-inactivo {
  display: none;
}

@media (max-width: 431px) {
  .tableMobile {
    min-width: 19rem !important;
  }
}

@media (max-width: 391px) {
  .tableMobile {
    min-width: 18rem !important;
  }
}

@media (max-width: 376px) {
  .tableMobile {
    min-width: 17rem !important;
  }
}

@media (max-width: 361px) {
  .tableMobile {
    min-width: 16rem !important;
  }
}
</style>