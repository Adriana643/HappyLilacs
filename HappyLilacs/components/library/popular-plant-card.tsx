import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/app-colors';
import type { PopularPlant } from '@/constants/sample-plants';

type Props = {
  plant: PopularPlant;
  onAdd: () => void;
};

export function PopularPlantCard({ plant, onAdd }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        style={styles.addButton}
        onPress={onAdd}
        accessibilityLabel={`Add ${plant.name}`}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
      <View style={styles.imagePlaceholder}>
        <IconSymbol name="leaf.fill" size={48} color={AppColors.muted} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.fits}>{plant.fitsLabel}</Text>
        <Text style={styles.name}>{plant.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    height: 168,
    backgroundColor: AppColors.card,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.addButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: '600',
    color: AppColors.body,
    marginTop: -2,
  },
  imagePlaceholder: {
    position: 'absolute',
    right: 8,
    top: 12,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labels: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    right: 10,
  },
  fits: { fontSize: 12, fontWeight: '600', color: AppColors.accentGreen },
  name: { fontSize: 14, fontWeight: '700', color: AppColors.body, marginTop: 2 },
});
