import React, { useMemo, useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from "expo-router";
import RemovePlantModal from '@/components/removePlantModal';
import { ScreenTopBanner } from '@/components/screen-top-banner';
import { ThemedText } from '@/components/themed-text';
import { AppColors } from '@/constants/app-colors';
import { PlantTask } from '@/types/plant';
import { getPlants, removePlant } from '@/services/user-plants';

function TodayCheckbox({ checked = false, onPress }: { checked?: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.checkbox}>
      <View style={[styles.checkboxInner, checked && styles.checkboxChecked]}>
        {checked && <ThemedText style={styles.checkmark}>✓</ThemedText>}
      </View>
    </TouchableOpacity>
  );
}

function OtherArrow() {
  return <ThemedText style={styles.arrow}>{'›'}</ThemedText>;
}

function RemoveButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.removeButton} activeOpacity={0.8}>
      <AntDesign name="minus" size={16} color="#D85B57" />
    </TouchableOpacity>
  );
}

function PlantThumb({ image }: { image?: string }) {
  if (image) return <Image source={{ uri: image }} style={styles.image} />;
  return (
    <View style={styles.imagePlaceholder}>
      <ThemedText style={styles.placeholder}></ThemedText>
    </View>
  );
}

function TodayPlantRow({ item, onToggle }: { item: PlantTask; onToggle: () => void }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.row}
        onPress={() => router.push(`/(tabs)/plants-info?id=${item.id}`)}
      >
        <PlantThumb image={item.image} />
        <View style={styles.textContainer}>
          <ThemedText numberOfLines={1} style={styles.title}>{item.title}</ThemedText>
          <ThemedText numberOfLines={1} style={styles.subtitle}>{item.subtitle}</ThemedText>
        </View>
        <TodayCheckbox checked={item.completed} onPress={onToggle} />
      </TouchableOpacity>
    </View>
  );
}

function OtherPlantRow({ item, isEditing, onRemovePress }: { item: PlantTask; isEditing: boolean; onRemovePress: () => void }) {
  return (
    <View style={styles.card}>
<TouchableOpacity activeOpacity={0.85} style={styles.row}  onPress={() => {
    if (!isEditing) {
      router.push(`/(tabs)/plants-info?id=${item.id}`);
    }
  }}
>       <PlantThumb image={item.image} />
        <View style={styles.textContainer}>
          <ThemedText numberOfLines={1} style={styles.title}>{item.title}</ThemedText>
          <ThemedText numberOfLines={1} style={styles.subtitle}>{item.subtitle}</ThemedText>
        </View>
        {isEditing ? <RemoveButton onPress={onRemovePress} /> : <OtherArrow />}
      </TouchableOpacity>
    </View>
  );
}

export default function MyPlantsScreen() {
  const [plants, setPlants] = useState<PlantTask[]>([]);
  const [isEditingOther, setIsEditingOther] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantTask | null>(null);

  useEffect(() => { loadPlants(); }, []);

  useFocusEffect(
    React.useCallback(() => { loadPlants(); }, [])
  );

  async function loadPlants() {
  const data = await getPlants();

  const filtered = data.filter(
    (plant) =>
      plant.title !== 'Plant task title' &&
      plant.title !== 'Test Plant'
  );

  const formatted = filtered.map((plant) => ({
    id: String(plant.id),
    title: plant.title,
    subtitle: plant.subtitle,
    image: plant.image,
    section: plant.section,
    completed: plant.completed ?? false,
  }));

  setPlants(formatted);
}

  const todayPlants = useMemo(() => plants.filter(p => p.section === 'today'), [plants]);
  const otherPlants = useMemo(() => plants.filter(p => p.section === 'other'), [plants]);

  const toggleCompleted = (id: string) => {
    setPlants(prev => prev.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  const handleRemovePress = (plant: PlantTask) => {
    setSelectedPlant(plant);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedPlant(null);
  };

  const confirmRemove = async () => {
    if (!selectedPlant) return;
    await removePlant(Number(selectedPlant.id));
    setPlants(prev => prev.filter(p => p.id !== selectedPlant.id));
    setShowRemoveModal(false);
    setSelectedPlant(null);
  };

  return (
    <View style={styles.screen}>
      <ScreenTopBanner title="My Plants" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Today</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>Check the plants you have watered today.</ThemedText>
          {todayPlants.map(plant => (
            <TodayPlantRow key={plant.id} item={plant} onToggle={() => toggleCompleted(plant.id)} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.otherHeader}>
            <ThemedText style={styles.sectionTitle}>Other</ThemedText>
            <TouchableOpacity onPress={() => setIsEditingOther(prev => !prev)} activeOpacity={0.8} style={styles.editButton}>
              <Feather name={isEditingOther ? 'x-circle' : 'edit-2'} size={22} color="#4C3E7E" />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.sectionSubtitle}>Future plants to water</ThemedText>
          {otherPlants.map(plant => (
            <OtherPlantRow
              key={plant.id}
              item={plant}
              isEditing={isEditingOther}
              onRemovePress={() => handleRemovePress(plant)}
            />
          ))}
        </View>
      </ScrollView>

      <RemovePlantModal
        visible={showRemoveModal}
        plantName={selectedPlant?.title ?? ''}
        onClose={closeRemoveModal}
        onConfirm={confirmRemove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#F7F7F7' 
  },
 
  scrollContent: { 
    paddingHorizontal: 14, 
    paddingTop: 18, 
    paddingBottom: 28 
  },
  
  section: { 
    marginBottom: 18 
  },
  
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#4C3E7E', 
    marginBottom: 8
   },
  
   sectionSubtitle: { 
    fontSize: 15, 
    color: '#3F3F3F', 
    marginBottom: 14 
  },
  
  otherHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
 
  editButton: { marginLeft: 8,
     marginTop: -2 }
     ,
  
     card: {
    backgroundColor: AppColors.white, 
    borderRadius: 18, 
    marginBottom: 12,
    paddingHorizontal: 14, 
    paddingVertical: 12,
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
 
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  
  image: { 
    width: 56, 
    height: 56, 
    borderRadius: 12, 
    marginRight: 12, 
    backgroundColor: '#ECECEC' 
  },
  
  imagePlaceholder: {
     width: 56, 
     height: 56,
      borderRadius: 12, 
      marginRight: 12, 
      backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  
      placeholder: { 
    fontSize: 22 
  },
  
  textContainer: { 
    flex: 1, 
    paddingRight: 10 
  },
  
  title: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#2F2F2F', 
    marginBottom: 4 
  },
  
  subtitle: { 
    fontSize: 14, 
    color: '#7D7D7D' 
  },
  
  checkbox: { 
    paddingLeft: 8, 
    paddingVertical: 4 
  },
  
  checkboxInner: { 
    width: 26, 
    height: 26, 
    borderRadius: 6, 
    borderWidth: 2, 
    borderColor: '#AEA1CC', 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'center'
   },
  
   checkboxChecked: { 
    backgroundColor: '#F5F1FB'
   },
  
   checkmark: { 
    fontSize: 16,
     color: '#9A8ABB',
      fontWeight: '700', 
      lineHeight: 18 
    },
  
    arrow: { fontSize: 28, 
    color: '#98A1AD', 
    marginLeft: 8, 
    paddingHorizontal: 2,
     marginTop: -2 },
  
     removeButton: { 
    width: 28, 
    height: 28, 
    borderRadius: 14,
     borderWidth: 2, 
     borderColor: '#D85B57', 
     alignItems: 'center', 
     justifyContent: 'center',
      marginLeft: 8, 
      backgroundColor: '#FFF' 
    },
});