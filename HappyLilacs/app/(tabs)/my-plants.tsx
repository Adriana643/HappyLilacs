import { StyleSheet, View } from 'react-native';

import { ScreenTopBanner } from '@/components/screen-top-banner';
import { ThemedText } from '@/components/themed-text';
import { AppColors } from '@/constants/app-colors';

export default function MyPlantsScreen() {
  return (
    <View style={styles.screen}>
      <ScreenTopBanner title="My Plants" />
      <View style={styles.body}>
        <ThemedText style={styles.sub}>Your collection will appear here.</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.white },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sub: { color: AppColors.muted, textAlign: 'center', fontSize: 16 },
});
