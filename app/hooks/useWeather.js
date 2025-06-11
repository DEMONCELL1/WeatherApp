import * as Location from 'expo-location';
import { useState } from 'react';
import {
  fetch5DayForecast,
  fetchCurrentWeather,
  fetchHourlyForecast,
  fetchWeatherByCity
} from '../services/weatherService';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [hourly, setHourly] = useState([]);
const [loadingHourly, setLoadingHourly] = useState(false);

async function loadHourlyForDate(date) {
  if (!weather?.lat || !weather?.lon) return;
  setLoadingHourly(true);
  try {
    const allHourly = await fetchHourlyForecast(weather.lat, weather.lon, 48);
    const target = date.slice(0,10); // "YYYY-MM-DD"
    const filtered = allHourly.filter(h => h.timestamp_local.startsWith(target));
    setHourly(filtered);
  } catch (e) {
    console.error(e);
  } finally {
    setLoadingHourly(false);
  }
}



  const loadByCoords = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Permission denied');
      const { coords } = await Location.getCurrentPositionAsync();
      const cw = await fetchCurrentWeather(coords.latitude, coords.longitude);
      const fc = await fetch5DayForecast(coords.latitude, coords.longitude);
      setWeather(cw);
      setForecast(fc);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const searchByCity = async city => {
    setLoading(true);
    try {
      const cw = await fetchWeatherByCity(city);
      const fc = await fetch5DayForecast(cw.lat, cw.lon);
      setWeather(cw);
      setForecast(fc);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (weather?.city_name) {
      searchByCity(weather.city_name);
    } else {
      loadByCoords();
    }
  };

  

  return { weather, forecast, error,
    loadByCoords, searchByCity, refresh,loading,
    hourly, loadingHourly, loadHourlyForDate };
}
