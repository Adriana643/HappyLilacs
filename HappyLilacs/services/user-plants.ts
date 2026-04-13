import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USER_PLANTS';

export type StoredPlant = {
  id: number;
  title: string;
  subtitle: string;
  image?: string;
  section: 'today' | 'other';
  completed?: boolean;
};

export async function savePlant(plant: StoredPlant) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const plants: StoredPlant[] = existing ? JSON.parse(existing) : [];

    // prevent duplicates
    const alreadyExists = plants.some(p => p.id === plant.id);
    if (alreadyExists) return;

    const updated = [...plants, plant];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.log('Error saving plant:', e);
  }
}

export async function getPlants(): Promise<StoredPlant[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log('Error loading plants:', e);
    return [];
  }
}

export async function removePlant(id: number) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const plants: StoredPlant[] = existing ? JSON.parse(existing) : [];
    const updated = plants.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.log('Error removing plant:', e);
  }
}