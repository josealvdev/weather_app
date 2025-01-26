import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

import { getWeatherIcon } from './../utils/wmo.js';
import citiesDB from "./../assets/es.json";

export const useCityStore = defineStore('city', () => {
    const cityObj = ref({});
    const citiesWeatherIcon = ref([]);
    
    function setCityWeatherIcon() {
        if (citiesWeatherIcon.value.length <= 0) {
            for (let i = 0; i < citiesDB.length; i++) {
                axios
                .get('https://api.open-meteo.com/v1/forecast?latitude='+citiesDB[i].lat+'&longitude='+citiesDB[i].lng+'&daily=weather_code')
                .then(response => {
                    citiesWeatherIcon.value[i] = getWeatherIcon(response.data.daily.weather_code[0]);
                });
            }
        }
    }

    return { cityObj, citiesWeatherIcon, setCityWeatherIcon }
});