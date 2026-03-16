import { useState, useCallback, useRef } from 'react';
import type { Topic } from '../types';
import { searchVocabulary, type SearchResult } from '../utils/search';

export function useSearch(topics: Topic[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const res = searchVocabulary(topics, q);
        setResults(res);
      }, 150);
    },
    [topics]
  );

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return { query, results, search, clear };
}
