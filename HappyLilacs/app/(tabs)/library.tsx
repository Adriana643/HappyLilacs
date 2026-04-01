import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PlantAddedModal } from '@/components/library/plant-added-modal';
import { PopularPlantCard } from '@/components/library/popular-plant-card';
import { ScreenTopBanner } from '@/components/screen-top-banner';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/app-colors';
import { SAMPLE_POPULAR_PLANTS } from '@/constants/sample-plants';

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addedPlantName, setAddedPlantName] = useState<string | null>(null);

  return (
    <View style={styles.screen}>
      <ScreenTopBanner title="Library" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Search plants</Text>
          <View style={styles.searchRow}>
            <IconSymbol name="magnifyingglass" size={22} color={AppColors.searchBorder} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              placeholderTextColor={AppColors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.popularHeader}>
            <Text style={styles.popularTitle}>Popular plants</Text>
            <Pressable>
              <Text style={styles.viewAll}>View all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
            nestedScrollEnabled>
            {SAMPLE_POPULAR_PLANTS.map((plant) => (
              <PopularPlantCard
                key={plant.id}
                plant={plant}
                onAdd={() => setAddedPlantName(plant.name)}
              />
            ))}
          </ScrollView>

          <View style={styles.divider} />

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              Type a plant name in the search bar above to start looking!
            </Text>
          </View>
        </View>
      </ScrollView>

      <PlantAddedModal
        visible={addedPlantName !== null}
        plantName={addedPlantName}
        onDismiss={() => setAddedPlantName(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.white },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  content: { backgroundColor: AppColors.white, paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.body,
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.searchBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 16, color: AppColors.body, paddingVertical: 0 },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
  },
  popularTitle: { fontSize: 17, fontWeight: '700', color: AppColors.body },
  viewAll: { fontSize: 14, fontWeight: '600', color: AppColors.accentGreen },
  cardsRow: { gap: 14, paddingRight: 8 },
  divider: {
    height: 1,
    backgroundColor: AppColors.divider,
    marginTop: 24,
    marginBottom: 20,
  },
  hint: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  hintText: {
    fontSize: 15,
    color: AppColors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
