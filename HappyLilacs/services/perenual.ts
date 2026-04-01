/** One row for Library (from Perenual species-list). */
export type LibraryPlant = {
  id: string;
  name: string;
  fitsLabel: string;
  imageUrl?: string | null;
};

const DEFAULT_BASE = 'https://perenual.com/api';

function getBaseUrl() {
  return process.env.EXPO_PUBLIC_PERENUAL_API_URL ?? DEFAULT_BASE;
}

function getApiKey() {
  return process.env.EXPO_PUBLIC_PERENUAL_API_KEY ?? '';
}

export type SpeciesListParams = {
  page?: number;
  /**
   * Species name keywords from the user. Sent to Perenual as the `q` query parameter
   * (see https://perenual.com/docs/api — species-list).
   */
  speciesNameSearch?: string;
  /** When aborted, `fetch` rejects — avoids applying stale results after the query changes. */
  signal?: AbortSignal;
};

type SpeciesListJson = {
  data?: PerenualSpeciesRaw[];
  to?: number;
  from?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
  total?: number;
};

type PerenualSpeciesRaw = {
  id: number;
  common_name?: string | null;
  scientific_name?: string[] | null;
  other_name?: string[] | null;
  family?: string | null;
  genus?: string | null;
  watering?: string | null;
  sunlight?: string[] | string | null;
  default_image?: {
    thumbnail?: string;
    small_url?: string;
    medium_url?: string;
    regular_url?: string;
    original_url?: string;
  } | null;
};

function sunlightToText(sunlight: PerenualSpeciesRaw['sunlight']): string {
  if (sunlight == null) return '';
  if (Array.isArray(sunlight)) return sunlight.filter(Boolean).join(', ');
  return String(sunlight);
}

function speciesDisplayName(species: PerenualSpeciesRaw): string {
  const common = species.common_name?.trim();
  if (common) return common;
  const other = species.other_name?.map((n) => n.trim()).find(Boolean);
  if (other) return other;
  return (species.scientific_name && species.scientific_name[0]) || 'Unknown plant';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wordBoundaryMatch(text: string, normalizedSearch: string): boolean {
  if (!normalizedSearch) return true;
  const escaped = escapeRegExp(normalizedSearch);
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text);
}

/**
 * Filters/ranks API rows for the Library search box. Perenual’s remote `q` match alone is often too broad.
 */
function speciesMatchesSearch(
  species: PerenualSpeciesRaw,
  normalizedSearch: string,
): { ok: boolean; rank: number } {
  if (!normalizedSearch) return { ok: true, rank: 0 };
  const common = species.common_name ?? '';
  const others = species.other_name ?? [];
  const sci = species.scientific_name ?? [];
  const scientificBlob = sci.join(' ').toLowerCase();
  const genus = (species.genus ?? '').toLowerCase();

  if (wordBoundaryMatch(common, normalizedSearch)) return { ok: true, rank: 0 };
  if (others.some((alias) => wordBoundaryMatch(alias, normalizedSearch))) return { ok: true, rank: 1 };
  if (normalizedSearch === 'rose' && (genus === 'rosa' || /\brosa\b/.test(scientificBlob)))
    return { ok: true, rank: 2 };
  if (genus && genus === normalizedSearch) return { ok: true, rank: 2 };
  if (sci.some((line) => wordBoundaryMatch(line, normalizedSearch))) return { ok: true, rank: 3 };
  return { ok: false, rank: 0 };
}

function formatPerenualHttpError(status: number, body: string): string {
  const trimmed = body.trim();
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    return `Plant data could not load (server error ${status}). Try again shortly.`;
  }
  const short = trimmed.replace(/\s+/g, ' ').slice(0, 120);
  return short ? `Perenual API ${status}: ${short}` : `Perenual API ${status}`;
}

export function mapSpeciesToLibraryPlant(species: PerenualSpeciesRaw): LibraryPlant {
  const name = speciesDisplayName(species);
  const water = species.watering?.trim() ?? '';
  const sun = sunlightToText(species.sunlight);
  const fitsLabel = [water, sun].filter(Boolean).join(' · ') || 'Fits well';
  const img = species.default_image;
  const imageUrl =
    img?.thumbnail ??
    img?.small_url ??
    img?.medium_url ??
    img?.regular_url ??
    img?.original_url ??
    null;

  return {
    id: String(species.id),
    name,
    fitsLabel,
    imageUrl,
  };
}

export async function fetchSpeciesList(params: SpeciesListParams = {}): Promise<{
  plants: LibraryPlant[];
  page: number;
  lastPage: number;
  total: number;
}> {
  const key = getApiKey();
  if (!key) {
    throw new Error(
      'Missing EXPO_PUBLIC_PERENUAL_API_KEY. Add it to .env (same value as PERENUAL_API_KEY).',
    );
  }

  const page = params.page ?? 1;
  const query = new URLSearchParams();
  query.set('key', key);
  query.set('page', String(page));
  const trimmedSearch = params.speciesNameSearch?.trim();
  if (trimmedSearch) {
    query.set('q', trimmedSearch);
  }

  const base = getBaseUrl().replace(/\/$/, '');
  const speciesListUrl = `${base}/v2/species-list`;
  const response = await fetch(`${speciesListUrl}?${query.toString()}`, {
    signal: params.signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(formatPerenualHttpError(response.status, text));
  }

  const listJson = (await response.json()) as SpeciesListJson;
  let rows = listJson.data ?? [];
  const normalizedSearch = trimmedSearch?.toLowerCase() ?? '';

  if (normalizedSearch) {
    rows = rows
      .map((species) => ({ species, match: speciesMatchesSearch(species, normalizedSearch) }))
      .filter(({ match }) => match.ok)
      .sort((a, b) => {
        if (a.match.rank !== b.match.rank) return a.match.rank - b.match.rank;
        return speciesDisplayName(a.species)
          .toLowerCase()
          .localeCompare(speciesDisplayName(b.species).toLowerCase());
      })
      .map(({ species }) => species);
  }

  const plants = rows.map(mapSpeciesToLibraryPlant);

  return {
    plants,
    page: listJson.current_page ?? page,
    lastPage: listJson.last_page ?? 1,
    total: listJson.total ?? plants.length,
  };
}
