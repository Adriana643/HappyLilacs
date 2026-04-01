import { ImageBackground, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-colors';

const bannerImage = require('@/assets/images/library-background.png');

type Props = {
  title: string;
};

/** Lavender header strip matching the Library screen (fixed under status bar). */
export function ScreenTopBanner({ title }: Props) {
  return (
    <ImageBackground source={bannerImage} style={styles.banner} imageStyle={styles.bannerImage}>
      <SafeAreaView edges={['top']} style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    minHeight: 108,
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  bannerImage: { resizeMode: 'cover' },
  inner: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: AppColors.purpleText },
});
