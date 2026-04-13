import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

type Props = {
  visible: boolean;
  plantName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function RemovePlantModal({ visible, plantName, onClose, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.topShape} />
          <View style={styles.bottomShape} />

          <ThemedText style={styles.title}>Remove Plant?</ThemedText>
          <ThemedText style={styles.plantName}>{plantName}</ThemedText>

          <ThemedText style={styles.subtitle}>
            You can add it back via the Library.
          </ThemedText>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <ThemedText style={styles.confirmText}>Remove</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(40,35,55,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#C4B0DF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  topShape: {
    position: 'absolute', top: -10, right: -10,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(110,77,149,0.2)',
  },
  bottomShape: {
    position: 'absolute', bottom: -20, left: -20,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(110,77,149,0.15)',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#4C3E7E', marginBottom: 6 },
  plantName: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 20 },
  subtitle: { fontSize: 16, color: '#FFF', textAlign: 'center', marginBottom: 24 },
  buttons: { flexDirection: 'row', gap: 12 },
  cancelButton: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 12, borderRadius: 12, alignItems: 'center',
  },
  cancelText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  confirmButton: {
    flex: 1, backgroundColor: '#D85B57',
    paddingVertical: 12, borderRadius: 12, alignItems: 'center',
  },
  confirmText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});