import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchSpeciesList, type LibraryPlant } from '@/services/perenual';

export const LIBRARY_MIN_SEARCH_LENGTH = 2;

const SEARCH_DEBOUNCE_MS = 600;
const POPULAR_CACHE_TTL_MS = 12 * 60 * 1000;
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;
const SEARCH_CACHE_MAX_KEYS = 16;

let popularListCache: { plants: LibraryPlant[]; fetchedAt: number } | null = null;

const searchResultCache = new Map<string, { plants: LibraryPlant[]; at: number }>();

function searchCacheKey(trimmed: string) {
  return trimmed.toLowerCase();
}

function readSearchCache(trimmed: string): LibraryPlant[] | null {
  const row = searchResultCache.get(searchCacheKey(trimmed));
  if (!row || Date.now() - row.at > SEARCH_CACHE_TTL_MS) return null;
  return row.plants;
}

function writeSearchCache(trimmed: string, plants: LibraryPlant[]) {
  const key = searchCacheKey(trimmed);
  if (searchResultCache.size >= SEARCH_CACHE_MAX_KEYS) {
    const first = searchResultCache.keys().next().value;
    if (first !== undefined) searchResultCache.delete(first);
  }
  searchResultCache.set(key, { plants, at: Date.now() });
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'AbortError' || /aborted/i.test(error.message))
  );
}

export function useLibraryPlants() {
  const [popular, setPopular] = useState<LibraryPlant[]>([]);
  const [searchResults, setSearchResults] = useState<LibraryPlant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [popularError, setPopularError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPopular = useCallback(async (forceRefresh = false) => {
    if (
      !forceRefresh &&
      popularListCache &&
      Date.now() - popularListCache.fetchedAt < POPULAR_CACHE_TTL_MS
    ) {
      setPopular(popularListCache.plants);
      setPopularError(null);
      setLoadingPopular(false);
      return;
    }

    if (forceRefresh) {
      popularListCache = null;
    }

    setLoadingPopular(true);
    setPopularError(null);
    try {
      const { plants } = await fetchSpeciesList({ page: 1 });
      popularListCache = { plants, fetchedAt: Date.now() };
      setPopular(plants);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not load plants.';
      setPopularError(message);
      setPopular([]);
    } finally {
      setLoadingPopular(false);
    }
  }, []);

  useEffect(() => {
    loadPopular(false);
  }, [loadPopular]);

  useEffect(() => {
    const trimmedSearch = searchQuery.trim();
    const abortController = new AbortController();

    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (trimmedSearch.length < LIBRARY_MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setSearchError(null);
      setLoadingSearch(false);
      return () => abortController.abort();
    }

    setLoadingSearch(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const cached = readSearchCache(trimmedSearch);
        if (cached) {
          if (!abortController.signal.aborted) {
            setSearchResults(cached);
            setSearchError(null);
          }
          return;
        }

        const { plants } = await fetchSpeciesList({
          speciesNameSearch: trimmedSearch,
          page: 1,
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) return;

        writeSearchCache(trimmedSearch, plants);
        setSearchResults(plants);
        setSearchError(null);
      } catch (e) {
        if (isAbortError(e)) return;
        if (!abortController.signal.aborted) {
          const message = e instanceof Error ? e.message : 'Search failed.';
          setSearchError(message);
          setSearchResults([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoadingSearch(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      abortController.abort();
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchQuery]);

  return {
    popular,
    searchResults,
    searchQuery,
    setSearchQuery,
    loadingPopular,
    loadingSearch,
    popularError,
    searchError,
    retry: () => loadPopular(true),
  };
}
