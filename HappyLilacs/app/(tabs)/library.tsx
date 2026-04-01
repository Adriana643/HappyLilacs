import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { PlantAddedModal } from '@/components/library/plant-added-modal';
import { PopularPlantCard } from '@/components/library/popular-plant-card';
import { ScreenTopBanner } from '@/components/screen-top-banner';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/app-colors';
import { LIBRARY_MIN_SEARCH_LENGTH, useLibraryPlants } from '@/hooks/use-library-plants';
/** Matches `content` horizontal padding — used to size the search grid to the visible column width. */
const CONTENT_PADDING_H = 20;
/** Same gap between columns and between rows for an even grid. */
const SEARCH_GRID_GAP = 14;

function chunkIntoPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

export default function LibraryScreen() {
  const [addedPlantName, setAddedPlantName] = useState<string | null>(null);
  const { width: windowWidth } = useWindowDimensions();
  const searchGridWidth = windowWidth - CONTENT_PADDING_H * 2;
  const searchCellSize = (searchGridWidth - SEARCH_GRID_GAP) / 2;

  const {
    popular,
    searchResults,
    searchQuery,
    setSearchQuery,
    loadingPopular,
    loadingSearch,
    popularError,
    searchError,
    retry,
  } = useLibraryPlants();

  const showSearchSection = searchQuery.trim().length >= LIBRARY_MIN_SEARCH_LENGTH;
  const searchResultRows = chunkIntoPairs(searchResults);

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
              autoCorrect={false}
              autoCapitalize="none"
            />
            {loadingSearch ? <ActivityIndicator size="small" color={AppColors.tabBar} /> : null}
          </View>

          {popularError ? (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{popularError}</Text>
              <Pressable onPress={retry} accessibilityRole="button">
                <Text style={styles.retry}>Retry</Text>
              </Pressable>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Popular plants</Text>
          {loadingPopular ? (
            <ActivityIndicator style={styles.loader} size="large" color={AppColors.tabBar} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsRow}
              nestedScrollEnabled>
              {popular.map((plant) => (
                <PopularPlantCard
                  key={plant.id}
                  plant={plant}
                  onAdd={() => setAddedPlantName(plant.name)}
                />
              ))}
            </ScrollView>
          )}

          <View style={styles.divider} />

          {showSearchSection ? (
            <View style={styles.searchBlock}>
              <Text style={styles.subheading}>Search results</Text>
              {searchError ? <Text style={styles.bannerText}>{searchError}</Text> : null}
              {loadingSearch ? (
                <ActivityIndicator style={styles.loader} color={AppColors.tabBar} />
              ) : searchResults.length === 0 && !searchError ? (
                <Text style={styles.hintText}>No plants match that search.</Text>
              ) : (
                <View style={styles.searchGrid}>
                  {searchResultRows.map((row, rowIndex) => (
                    <View
                      key={row.map((p) => p.id).join('-')}
                      style={[
                        styles.searchGridRow,
                        rowIndex < searchResultRows.length - 1 ? styles.searchGridRowSpacing : null,
                      ]}>
                      {row.map((plant, colIndex) => (
                        <View
                          key={`search-${plant.id}`}
                          style={[
                            styles.searchGridCell,
                            { width: searchCellSize },
                            colIndex === 0 && row.length === 2 ? styles.searchGridCellGap : null,
                          ]}>
                          <PopularPlantCard
                            plant={plant}
                            onAdd={() => setAddedPlantName(plant.name)}
                            style={{ width: searchCellSize, height: searchCellSize }}
                          />
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.hint}>
              <Text style={styles.hintText}>
                Type at least {LIBRARY_MIN_SEARCH_LENGTH} characters to search, or browse popular plants
                above.
              </Text>
            </View>
          )}
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
  content: {
    backgroundColor: AppColors.white,
    paddingHorizontal: CONTENT_PADDING_H,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.body,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.body,
    marginBottom: 12,
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
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 16, color: AppColors.body, paddingVertical: 0 },
  banner: { marginBottom: 16, gap: 8 },
  bannerText: { fontSize: 14, color: AppColors.muted, lineHeight: 20 },
  retry: { fontSize: 15, fontWeight: '600', color: AppColors.accentGreen },
  loader: { marginVertical: 16 },
  cardsRow: { gap: 14, paddingRight: 8 },
  divider: {
    height: 1,
    backgroundColor: AppColors.divider,
    marginTop: 24,
    marginBottom: 20,
  },
  searchBlock: { marginBottom: 24 },
  searchGrid: {
    width: '100%',
    flexDirection: 'column',
  },
  searchGridRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  searchGridRowSpacing: {
    marginBottom: SEARCH_GRID_GAP,
  },
  searchGridCell: {
    overflow: 'hidden',
  },
  searchGridCellGap: {
    marginRight: SEARCH_GRID_GAP,
  },
  hint: {
    minHeight: 80,
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
