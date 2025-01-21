import wmo_codes from "./../assets/wmo.json";

export function getWeatherIcon(weather_code) {
    return wmo_codes[weather_code].day.image;
}