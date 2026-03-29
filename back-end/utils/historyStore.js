const history = [];

function normalizeText(value) {
  return String(value || "").trim();
}

function saveHistory(entry = {}) {
  const searchQuery = normalizeText(entry.searchQuery ?? entry.searchedFor?.query ?? entry.city);

  if (!searchQuery) {
    return null;
  }

  const storedEntry = {
    searchedBy: {
      ipAddress: normalizeText(entry.searchedBy?.ipAddress ?? entry.clientIp) || null,
      userAgent: normalizeText(entry.searchedBy?.userAgent ?? entry.userAgent) || null,
      userId: normalizeText(entry.searchedBy?.userId) || null,
    },
    searchedFor: {
      query: searchQuery,
      type: entry.searchType ?? entry.searchedFor?.type ?? "city",
      resolvedName: normalizeText(entry.searchedFor?.resolvedName ?? entry.city) || null,
    },
    weather: {
      condition: normalizeText(entry.weather?.condition ?? entry.weatherCondition) || null,
      code: Number.isFinite(Number(entry.weather?.code ?? entry.weatherCode))
        ? Number(entry.weather?.code ?? entry.weatherCode)
        : null,
      temperature: Number.isFinite(Number(entry.weather?.temperature))
        ? Number(entry.weather.temperature)
        : null,
      feelsLike: Number.isFinite(Number(entry.weather?.feelsLike))
        ? Number(entry.weather.feelsLike)
        : null,
      humidity: Number.isFinite(Number(entry.weather?.humidity))
        ? Number(entry.weather.humidity)
        : null,
      windSpeed: Number.isFinite(Number(entry.weather?.windSpeed))
        ? Number(entry.weather.windSpeed)
        : null,
      precipitation: Number.isFinite(Number(entry.weather?.precipitation))
        ? Number(entry.weather.precipitation)
        : null,
    },
    searchedAt: new Date(),
  };

  history.unshift(storedEntry);

  if (history.length > 100) {
    history.pop();
  }

  return storedEntry;
}

function listHistory() {
  return history.map((entry) => ({ ...entry }));
}

module.exports = {
  listHistory,
  saveHistory,
};