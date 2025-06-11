import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { HomeScreen } from '../app/screens/HomeScreen';
import { HourlyForecast } from '../app/screens/HourlyForecast';

const Stack = createStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Weather App" component={HomeScreen} />
      <Stack.Screen name="HourlyForecast" component={HourlyForecast} />
    </Stack.Navigator>
  );
} 