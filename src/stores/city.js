import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

import { getWeatherIcon } from './../utils/wmo.js';
import citiesDB from "./../assets/db/es.json";

export const useCityStore = defineStore('city', () => {
    const cityObj = ref({});
    const citiesWeatherIcon = ref([]);
    
    function setCityWeatherIcon() {
        let storeIcons = JSON.parse(localStorage.getItem('citiesWeatherIcon')) || [];

        if (storeIcons.length <= 0) {
            let lats = '';
            let lngs = '';

            for (let i = 0; i < citiesDB.length; i++) {
                lats += citiesDB[i].lat + ',';
                lngs += citiesDB[i].lng + ',';
            }

            axios
            .get('https://api.open-meteo.com/v1/forecast?latitude='+lats+'&longitude='+lngs+'&daily=weather_code')
            .then(response => {
                for (let j = 0; j < citiesDB.length; j++) {
                    citiesWeatherIcon.value[j] = getWeatherIcon(response.data[j].daily.weather_code[0]);
                }
            }).finally(() => {
                localStorage.setItem('citiesWeatherIcon', JSON.stringify(citiesWeatherIcon.value));
            });
        } else {
            for (let k = 0; k < storeIcons.length; k++) {
                citiesWeatherIcon.value[k] = storeIcons[k];
            }
        }
    }

    return { cityObj, citiesWeatherIcon, setCityWeatherIcon }
});