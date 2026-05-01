import { useState, useEffect, useCallback, useRef } from 'react';

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

/**
 * useCardSearch — fetches cards from /api/cards with debounced filtering.
 *
 * Returns:
 *   cards       CardDefinition[]   current results
 *   total       number
 *   loading     bool
 *   error       string|null
 *   filters     object             current filter values
 *   setFilter   fn(key, value)     update one filter
 *   clearFilters fn()
 */
export function useCardSearch() {
  const [filters, setFilters] = useState({
    title:       '',
    type:        '',
    affiliation: '',
    set:         '',
    skill:       '',
  });

  const [cards,   setCards]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const debounceRef = useRef(null);

  const fetchCards = useCallback(async (f) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (f.title)       params.set('title',       f.title);
    if (f.type)        params.set('type',        f.type);
    if (f.affiliation) params.set('affiliation', f.affiliation);
    if (f.set)         params.set('set',         f.set);
    if (f.skill)       params.set('skill',       f.skill);

    try {
      const res  = await fetch(`${SERVER}/api/cards?${params}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setCards(data.cards);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce: wait 250ms after last filter change before fetching
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchCards(filters), 250);
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchCards]);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ title:'', type:'', affiliation:'', set:'', skill:'' });
  }, []);

  return { cards, total, loading, error, filters, setFilter, clearFilters };
}

/**
 * useStarterDecks — fetches the list of available starter decks.
 */
export function useStarterDecks() {
  const [decks,   setDecks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch(`${SERVER}/api/decks`)
      .then(r => { if (!r.ok) throw new Error(`Server error ${r.status}`); return r.json(); })
      .then(data => { setDecks(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return { decks, loading, error };
}
