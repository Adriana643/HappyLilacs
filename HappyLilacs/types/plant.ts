export type PlantTask = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  section: 'today' | 'other';
  completed?: boolean;
};