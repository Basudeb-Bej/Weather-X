export function SearchBar({
  query,
  setQuery,
  suggestions,
  loadingSuggestions,
  isOpen,
  setIsOpen,
  selectSuggestion,
  onSearch,
  onSearchLocation,
  loading,
  locationStatus,
  searchHint,
}) {
  const hasSuggestions = isOpen && (loadingSuggestions || suggestions.length > 0);
  const isLocationEnabled = locationStatus === "granted";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = query.trim();
    if (!value) {
      return;
    }

    await onSearch(value);
    setIsOpen(false);
  };

  const handleSuggestionClick = async (suggestion) => {
    const selectedLabel = selectSuggestion(suggestion);
    await onSearchLocation(
      {
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
        name: selectedLabel,
      },
      selectedLabel,
    );
  };

  return (
    <section className="glass-panel panel-hover rounded-3xl p-5 sm:p-6">
      <form className="flex flex-col gap-3 sm:flex-row sm:items-start" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="city-search">
          Search city
        </label>
        <div className="w-full">
          <input
            id="city-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search any city"
            autoComplete="off"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
          />

          {hasSuggestions ? (
            <div className="mt-3 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
              {loadingSuggestions ? (
                <div className="px-4 py-4 text-sm text-slate-300">Searching cities...</div>
              ) : suggestions.length > 0 ? (
                <ul className="max-h-72 overflow-auto py-2">
                  {suggestions.map((suggestion) => (
                    <li key={`${suggestion.id}-${suggestion.latitude}-${suggestion.longitude}`}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition hover:bg-white/5"
                      >
                        <span className="text-sm font-medium text-white">{suggestion.label}</span>
                        <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          {suggestion.latitude.toFixed(2)}, {suggestion.longitude.toFixed(2)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-sm text-slate-400">No matching cities found.</div>
              )}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 shrink-0 self-start rounded-2xl bg-sky-400 px-5 font-medium text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-slate-400 sm:text-[10px]">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${isLocationEnabled ? "border-emerald-400/30 text-emerald-300" : "border-white/10"}`}
        >
          {isLocationEnabled ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
              <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" aria-hidden="true">
                <path d="M6.7 10.7 4 8l-1 1 3.7 3.7L13 6.4l-1-1-5.3 5.3Z" fill="currentColor" />
              </svg>
            </span>
          ) : null}
          <span className="text-[8px] leading-none sm:text-[9px]">
            {locationStatus === "granted" ? "Location enabled" : locationStatus === "denied" ? "Location denied" : "Auto location ready"}
          </span>
        </span>
      </div>

      {searchHint ? (
        <div className="mt-3 rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
          {searchHint}
        </div>
      ) : null}
    </section>
  );
}