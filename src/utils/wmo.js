import wmo_codes from "./../assets/db/wmo.json";

export function getWeatherIcon(weather_code) {
    return wmo_codes[weather_code].day.image;
}