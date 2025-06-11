import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const weatherIcons = {
  sunny: 'https://www.weatherbit.io/static/img/icons/c01d.png',
  rainy: 'https://www.weatherbit.io/static/img/icons/r01d.png',
  cloudy: 'https://www.weatherbit.io/static/img/icons/c03d.png',
  default: 'https://www.weatherbit.io/static/img/icons/c04d.png',
};

export function WeatherCard({ location, temp, condition, humidity, windSpeed, icon }) {
  const iconUrl =
    condition.toLowerCase().includes('sun')
      ? weatherIcons.sunny
      : condition.toLowerCase().includes('rain')
      ? weatherIcons.rainy
      : condition.toLowerCase().includes('cloud')
      ? weatherIcons.cloudy
      : weatherIcons.default;

  return (
    <View style={styles.card}>
      <Text style={styles.location}>{location}</Text>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <Text style={styles.temp}>{temp}°C</Text>
      <Text style={styles.condition}>{condition}</Text>
      <Text style={styles.details}>Humidity: {humidity}%</Text>
      <Text style={styles.details}>Wind Speed: {windSpeed} m/s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  location: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  icon: { width: 100, height: 100, marginBottom: 8 },
  temp: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  condition: { fontSize: 18, color: '#555', marginBottom: 8 },
  details: { fontSize: 14, color: '#777' },
});