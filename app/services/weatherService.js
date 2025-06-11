const API_KEY = '549e630f8f9344baa757552f102ed82a';
const BASE_URL = 'https://api.weatherbit.io/v2.0';

export async function fetchCurrentWeather(lat, lon) {
  const url = `${BASE_URL}/current?lat=${lat}&lon=${lon}&key=${API_KEY}&units=M`;
  const res = await fetch(url);
  if (!res.ok) throw new Error((await res.json()).error || 'Error fetching current weather');
  const data = await res.json();
  return data.data[0];
}

export async function fetchWeatherByCity(city) {
  const url = `${BASE_URL}/current?city=${encodeURIComponent(city)}&key=${API_KEY}&units=M`;
  const res = await fetch(url);
  if (!res.ok) throw new Error((await res.json()).error || 'Error fetching weather by city');
  const data = await res.json();
  return data.data[0];
}

export async function fetch5DayForecast(lat, lon) {
  const url = `${BASE_URL}/forecast/daily?lat=${lat}&lon=${lon}&key=${API_KEY}&units=M&days=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error fetching forecast');
  const data = await res.json();
  return data.data;  // Array of daily forecasts :contentReference[oaicite:0]{index=0}
}

/**
 * Fetch hourly forecast (up to 48+ hours).
 */
export async function fetchHourlyForecast(lat, lon, hours = 48) {
    const url = `${BASE_URL}/forecast/hourly?lat=${lat}&lon=${lon}&key=${API_KEY}&units=M&hours=${hours}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch hourly forecast');
    const data = await res.json();
    return data.data; // Array of hourly data :contentReference[oaicite:1]{index=1}
  }
  