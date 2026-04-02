import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenTopBanner } from '@/components/screen-top-banner';
import { ThemedText } from '@/components/themed-text';
import { AppColors } from '@/constants/app-colors';

const PERENUAL_API_KEY = process.env.EXPO_PUBLIC_PERENUAL_API_KEY ?? '';

const today = new Date();

const todayLabel = today.toLocaleDateString('en-US', {
  month: 'long', day: 'numeric', year: 'numeric',
});

const alertDateLabel = today.toLocaleDateString('en-US', {
  month: 'long', day: 'numeric',
});

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const calendarDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() - 1 + i);
  return {
    key: `cal-${i}`,
    date: d.getDate(),
    month: MONTH_NAMES[d.getMonth()],
    dayName: DAY_NAMES[d.getDay()],
    isToday: i === 1,
  };
});

type Plant = {
  id: number;
  name: string;
  imageUrl: string;
  wateringFrequency: string;
};

async function fetchPlantDetails(id: number): Promise<Plant | null> {
  try {
    const res = await fetch(
      `https://perenual.com/api/species/details/${id}?key=${PERENUAL_API_KEY}`
    );
    const data = await res.json();
    return {
      id: data.id,
      name: data.common_name ?? data.scientific_name?.[0] ?? 'Unknown',
      imageUrl: data.default_image?.small_url ?? data.default_image?.regular_url ?? '',
      wateringFrequency: data.watering ?? 'Regular',
    };
  } catch {
    return null;
  }
}

const MY_PLANT_IDS = [3277, 1168];

export default function HomeScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlants() {
      setLoading(true);
      const results = await Promise.all(MY_PLANT_IDS.map(fetchPlantDetails));
      setPlants(results.filter((p): p is Plant => p !== null));
      setLoading(false);
    }
    loadPlants();
  }, []);

  const alerts = plants.map((plant, i) => ({
    key: `alert-${i}-${plant.id}`,
    title: `Water your ${plant.name}`,
    subtitle: `Water ${plant.wateringFrequency.toLowerCase()} — tap for care details`,
    imageUrl: plant.imageUrl,
  }));

  return (
    <View style={styles.screen}>
      <ScreenTopBanner title="Welcome, Nara" />
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* My Plants */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>My plants</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.viewAll}>View all</ThemedText>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color={AppColors.tabBar} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plantsRow}>
            {plants.map((plant, i) => (
              <View key={`plant-${i}-${plant.id}`} style={styles.plantCard}>
                {plant.imageUrl ? (
                  <Image source={{ uri: plant.imageUrl }} style={styles.plantImage} />
                ) : (
                  <View style={[styles.plantImage, styles.plantImageFallback]}>
                    <Ionicons name="leaf-outline" size={40} color={AppColors.muted} />
                  </View>
                )}
                <ThemedText style={styles.plantName}>{plant.name}</ThemedText>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Calendar */}
        <ThemedText style={styles.dateTitle}>Today is {todayLabel}</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.calendarRow}
          contentContainerStyle={styles.calendarContent}
        >
          {calendarDays.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={[styles.dayChip, day.isToday && styles.dayChipActive]}
            >
              <ThemedText style={[styles.dayMonth, day.isToday && styles.dayTextActive]}>
                {day.month}
              </ThemedText>
              <ThemedText style={[styles.dayNumber, day.isToday && styles.dayTextActive]}>
                {day.date}
              </ThemedText>
              <ThemedText style={[styles.dayName, day.isToday && styles.dayTextActive]}>
                {day.dayName}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Alerts */}
        <ThemedText style={styles.sectionTitle}>Alerts for {alertDateLabel}</ThemedText>
        {loading ? (
          <ActivityIndicator style={styles.loader} color={AppColors.tabBar} />
        ) : (
          <View>
            {alerts.map((alert) => (
              <TouchableOpacity key={alert.key} style={styles.alertCard}>
                {alert.imageUrl ? (
                  <Image source={{ uri: alert.imageUrl }} style={styles.alertImage} />
                ) : (
                  <View style={[styles.alertImage, styles.plantImageFallback]}>
                    <Ionicons name="leaf-outline" size={20} color={AppColors.muted} />
                  </View>
                )}
                <View style={styles.alertText}>
                  <ThemedText style={styles.alertTitle}>{alert.title}</ThemedText>
                  <ThemedText style={styles.alertSub} numberOfLines={1}>{alert.subtitle}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={AppColors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.white },
  body: { flex: 1, backgroundColor: AppColors.white },
  loader: { marginVertical: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 16, marginTop: 20 },
  viewAll: { fontSize: 14, color: '#7CB342' },
  plantsRow: { paddingLeft: 16, marginTop: 10 },
  plantCard: {
    width: 160,
    backgroundColor: AppColors.white,
    borderRadius: 16,
    marginRight: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  plantImage: { width: '100%', height: 120, resizeMode: 'contain', borderRadius: 8 },
  plantImageFallback: {
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantName: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  dateTitle: { fontSize: 16, fontWeight: '500', paddingHorizontal: 16, marginTop: 24 },
  calendarRow: { paddingHorizontal: 16, marginTop: 12 },
  calendarContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  dayChip: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#F3F3F3',
  },
  dayChipActive: { backgroundColor: '#6B4FA0' },
  dayMonth: { fontSize: 11, color: AppColors.muted },
  dayNumber: { fontSize: 22, fontWeight: '700', marginVertical: 2 },
  dayName: { fontSize: 11, color: AppColors.muted },
  dayTextActive: { color: AppColors.white },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: AppColors.white,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  alertImage: { width: 48, height: 48, borderRadius: 8, resizeMode: 'cover' },
  alertText: { flex: 1, marginLeft: 12 },
  alertTitle: { fontSize: 14, fontWeight: '600' },
  alertSub: { fontSize: 12, color: AppColors.muted, marginTop: 2 },
  sub: { color: AppColors.muted, textAlign: 'center', fontSize: 16 },
});