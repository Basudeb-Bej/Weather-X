import { useEffect, useMemo, useState } from "react";
import { searchCities } from "../services/weatherService";

function formatLocation(result) {
  return [result.name, result.admin1, result.country]
    .filter(Boolean)
    .join(", ");
}

export function useCitySearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    let alive = true;
    const timeoutId = window.setTimeout(async () => {
      const term = normalizedQuery;

      if (term.length < 2) {
        setSuggestions([]);
        setLoadingSuggestions(false);
        return;
      }

      setLoadingSuggestions(true);

      try {
        const { results } = await searchCities(term);

        if (!alive) {
          return;
        }

        setSuggestions(
          results.slice(0, 6).map((result) => ({
            ...result,
            label: formatLocation(result),
          })),
        );
      } catch {
        if (alive) {
          setSuggestions([]);
        }
      } finally {
        if (alive) {
          setLoadingSuggestions(false);
        }
      }
    }, 300);

    return () => {
      alive = false;
      window.clearTimeout(timeoutId);
    };
  }, [normalizedQuery]);

  const selectSuggestion = (suggestion) => {
    const label = formatLocation(suggestion);
    setQuery(label);
    setSuggestions([]);
    setIsOpen(false);

    return label;
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
  };

  return {
    query,
    setQuery,
    suggestions,
    loadingSuggestions,
    isOpen,
    setIsOpen,
    selectSuggestion,
    clearSearch,
    hasQuery: normalizedQuery.length > 0,
  };
}