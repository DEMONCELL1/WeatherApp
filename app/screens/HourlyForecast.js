import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export function HourlyForecast({ route }) {
  const { dayData } = route.params;

  const hourlyData = dayData.hourly || Array(24).fill({ temp: 'Data Unavailable' });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast for {dayData.valid_date}</Text>
      <FlatList
        data={hourlyData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.hourCard}>
            <Text style={styles.hour}>{index}:00</Text>
            <Text style={styles.temp}>{item.temp}°C</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f4f7' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  hourCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hour: { fontSize: 16, fontWeight: 'bold' },
  temp: { fontSize: 16, color: '#555' },
});