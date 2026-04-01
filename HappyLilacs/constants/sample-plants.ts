export type PopularPlant = {
  id: string;
  name: string;
  fitsLabel: string;
};

/** Placeholder data until API / Supabase is wired. */
export const SAMPLE_POPULAR_PLANTS: PopularPlant[] = [
  {
    id: '1',
    name: 'Peperomia',
    fitsLabel: 'Fits well',
  },
  {
    id: '2',
    name: 'Asplenium',
    fitsLabel: 'Fits well',
  },
  {
    id: '3',
    name: 'Monstera',
    fitsLabel: 'Fits well',
  },
];
