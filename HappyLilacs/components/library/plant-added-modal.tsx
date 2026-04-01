import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppColors } from '@/constants/app-colors';

const headerImage = require('@/assets/images/library-background.png');

type Props = {
  visible: boolean;
  plantName: string | null;
  onDismiss: () => void;
};

export function PlantAddedModal({ visible, plantName, onDismiss }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} accessibilityLabel="Dismiss" />
        <View style={styles.cardWrap} pointerEvents="box-none">
          <ImageBackground source={headerImage} style={styles.card} imageStyle={styles.cardImage}>
            <View style={styles.tint}>
              <Text style={styles.heading}>Plant Added:</Text>
              <Text style={styles.plantName}>{plantName}</Text>
              <Text style={styles.message}>
                You will be able to view your plant by tapping on the My Plants tab.
              </Text>
              <Pressable
                style={styles.button}
                onPress={onDismiss}
                accessibilityRole="button"
                accessibilityLabel="Understood">
                <Text style={styles.buttonLabel}>Understood!</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: AppColors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardWrap: { width: '100%', maxWidth: 340 },
  card: { borderRadius: 20, overflow: 'hidden', alignItems: 'center' },
  cardImage: { borderRadius: 20 },
  tint: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 22,
    backgroundColor: AppColors.modalPhotoTint,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.purpleText,
    marginBottom: 8,
  },
  plantName: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: AppColors.white,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
    opacity: 0.95,
  },
  button: {
    backgroundColor: AppColors.darkPurple,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonLabel: { color: AppColors.white, fontSize: 16, fontWeight: '700' },
});
