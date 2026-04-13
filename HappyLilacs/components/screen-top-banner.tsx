import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/app-colors';

const bannerImage = require('@/assets/images/library-background.png');

type Props = {
  title: string;
  onBack?: () => void;
};

export function ScreenTopBanner({ title, onBack }: Props) {
  return (
    <ImageBackground source={bannerImage} style={styles.banner} imageStyle={styles.bannerImage}>
      <SafeAreaView edges={['top']} style={styles.inner}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        )}
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
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 26, fontWeight: '700', color: AppColors.purpleText },
});