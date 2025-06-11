import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { WeatherCard } from '../components/WeatherCard';
import { useWeather } from '../hooks/useWeather';
import { showToast } from '../utils/toast';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;

export function HomeScreen() {
  const {
    weather,
    forecast,
    error,
    loading,
    loadByCoords,
    searchByCity,
    refresh,
    hourly,
    loadingHourly,
    loadHourlyForDate,
  } = useWeather();

  const [city, setCity] = React.useState('');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('');

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['40%', '80%'], []);

  useEffect(() => {
    loadByCoords();
  }, []);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    };

    const handleCardPress = async (item) => {
        const date = item.valid_date;
        // Fetch hourly first
        await loadHourlyForDate(date);
        if (!hourly.length) {
            showToast('No hourly data available for this day');
            return;
        }
        setSelectedDate(date);
        console.log('Selected date:----', date);
        sheetRef.current?.expand();
    };

  return (
    <SafeAreaView style={styles.safe}>
      <TextInput
        placeholder="Search city..."
        value={city}
        onChangeText={setCity}
        onSubmitEditing={() => searchByCity(city.trim())}
        style={styles.searchInput}
      />

      {loading && <ActivityIndicator size="large" style={styles.loading} />}
    
      {weather && (
        <View style={{  marginTop: 20 }}> 
        <WeatherCard
          location={weather.city_name || weather.city}
          temp={weather.temp}
          condition={weather.weather.description}
          humidity={weather.rh}
          windSpeed={weather.wind_spd}
        />
        </View>
      )}

          {error && <Text style={styles.error}>{error}</Text>}

          <FlatList
              data={forecast}
              horizontal
                showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={styles.listContainer}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              refreshControl={
                  <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleCardPress(item)}>
                      <View style={styles.cardWrapper}>
                          <WeatherCard
                              // Display day of the week from valid_date:
                              location={new Date(item.valid_date).toLocaleDateString(undefined, {
                                  weekday: 'short',
                              })}
                              temp={item.temp}
                              condition={item.weather.description}
                              humidity={item.rh}
                              windSpeed={item.wind_spd}
                          />
                      </View>
                  </TouchableOpacity>
              )}
          />

          <BottomSheet
              ref={sheetRef}
              index={-1}                     // start closed
              snapPoints={snapPoints}
              enablePanDownToClose={true}   // allow closing via swipe
          >
              <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>
                      {selectedDate
                          ? new Date(selectedDate).toLocaleDateString(undefined, {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                          })
                          : 'Hourly Forecast'}
                  </Text>
              </View>

              <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
                  {loadingHourly ? (
                      <ActivityIndicator size="small" />
                  ) : (
                      hourly.map(h => (
                          <View key={h.ts} style={styles.hourRow}>
                              <Text style={styles.hourText}>{h.timestamp_local.slice(11, 16)}</Text>
                              <Image
                                  source={{
                                      uri: `https://www.weatherbit.io/static/img/icons/${h.weather.icon}.png`,
                                  }}
                                  style={styles.hourIcon}
                              />
                              <Text style={styles.hourTemp}>{Math.round(h.temp)}°C</Text>
                          </View>
                      ))
                  )}
              </BottomSheetScrollView>
          </BottomSheet>
          
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width:width*0.9,alignSelf:'center', backgroundColor: '#f0f4f7' },
  loading: { marginTop: 20 },
  searchInput: { marginTop: 16, marginBottom: 16,padding: 12, width:width*0.9, borderWidth: 1, borderRadius: 8, backgroundColor: '#fff' },
  flatList: { marginTop: 16 },
  error: { color: 'red', textAlign: 'center', marginVertical: 8 },
  listContainer: {
    paddingHorizontal: 5,
    marginTop: 20, 
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  sheetHeader: { padding: 16, borderBottomWidth: 1, borderColor: '#ddd' },
  sheetTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  sheetContent: { padding: 16 },
  hourRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  hourText: { width: 60 },
  hourIcon: { width: 30, height: 30, marginHorizontal: 16 },
  hourTemp: { fontSize: 16, fontWeight: '500' },
});
