import * as Location from 'expo-location';
import React, { createContext, useEffect, useState } from 'react';
import { fetchCurrentWeather, fetchFiveDayForecast } from '../services/weatherService';

export const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Location permission denied');
      const { coords } = await Location.getCurrentPositionAsync({});
      const currentWeather = await fetchCurrentWeather(coords.latitude, coords.longitude);
      const dailyForecast = await fetchFiveDayForecast(coords.latitude, coords.longitude);
      setWeather(currentWeather);
      setForecast(dailyForecast);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <WeatherContext.Provider value={{
      weather,
      forecast,
      loading,
      error,
      refresh: load,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}