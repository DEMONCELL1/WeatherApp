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
    await loadHourlyForDate(date);
    if (!hourly.length) {
      showToast('No hourly data available for this day');
      return;
    }
    setSelectedDate(date);
    sheetRef.current?.expand();
  };

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonInner}>
        <View style={styles.skeletonLocation} />
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonTemp} />
        <View style={styles.skeletonCondition} />
        <View style={styles.skeletonDetails} />
        <View style={styles.skeletonDetails} />
      </View>
    </View>
  );

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

      {loading && !weather ? (
        renderSkeletonLoader()
      ) : (
        weather && (
          <View style={{ marginTop: 20 }}>
            <WeatherCard
              location={weather.city_name || weather.city}
              temp={weather.temp}
              condition={weather.weather.description}
              humidity={weather.rh}
              windSpeed={weather.wind_spd}
            />
          </View>
        )
      )}

          {error && <Text style={styles.error}>{error}</Text>}

          <FlatList
              data={loading ? Array(5).fill({}) : forecast} // Render 5 skeleton items if loading
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={styles.listContainer}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              refreshControl={
                  <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) =>
                  loading ? (
                      renderSkeletonLoader()
                  ) : (
                      <TouchableOpacity onPress={() => handleCardPress(item)}>
                          <View style={styles.cardWrapper}>
                              <WeatherCard
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
                  )
              }
          />

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
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
            hourly.map((h) => (
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
  safe: { flex: 1, width: width * 0.9, alignSelf: 'center', backgroundColor: '#f0f4f7' },
  loading: { marginTop: 20 },
  searchInput: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    width: width * 0.9,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
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
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: 6, // Add spacing between cards
    overflow: 'hidden', // Ensure content stays within the card
  },skeletonCard: {
    flex: 1, // Ensure it takes up the full space of the card
    width: CARD_WIDTH, // Match the card's width
    height: 200, // Match the card's height
    backgroundColor: '#e0e0e0', // Light grey background
    borderRadius: 16, // Match the card's border radius
    padding: 16, // Add padding for internal elements
    justifyContent: 'space-between', // Space out internal elements
    alignItems: 'center', // Center align internal elements
    overflow: 'hidden', // Prevent content from spilling outside
  },

  skeletonInner: {
    width: '100%', // Ensure inner elements fit within the card
    alignItems: 'center', // Center align inner elements
  },

  skeletonLocation: {
    width: '60%',
    height: 20,
    backgroundColor: '#d0d0d0', // Slightly darker grey
    borderRadius: 4,
    marginBottom: 12,
  },

  skeletonIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#d0d0d0',
    borderRadius: 40,
    marginBottom: 12,
  },

  skeletonTemp: {
    width: '40%',
    height: 30,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    marginBottom: 8,
  },

  skeletonCondition: {
    width: '50%',
    height: 20,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    marginBottom: 8,
  },

  skeletonDetails: {
    width: '70%',
    height: 15,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    marginBottom: 4,
  },
});
