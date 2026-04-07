import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ??
  (import.meta.env.DEV ? "http://localhost:8000" : "");

function getApiUrl(path) {
  if (apiBaseUrl) {
    return `${apiBaseUrl}${path}`;
  }

  return path;
}

const geocodingClient = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
  timeout: 12000,
});

const forecastClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 12000,
});

const forecastCache = new Map();
const FORECAST_CACHE_TTL = 5 * 60 * 1000;

function normalizeCoordinate(value) {
  return Number.parseFloat(Number(value).toFixed(4));
}

function getForecastCacheKey(latitude, longitude) {
  return `${normalizeCoordinate(latitude)}:${normalizeCoordinate(longitude)}`;
}

function normalizeQuery(query) {
  return query.replace(/\s+/g, " ").trim();
}

function buildSearchCandidates(query) {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return [];
  }

  const candidates = [normalized];
  const commaParts = normalized
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length >= 3)
    .reverse();

  for (const part of commaParts) {
    if (!candidates.includes(part)) {
      candidates.push(part);
    }
  }

  const spaceParts = normalized
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Z\s.-]/g, "").trim())
    .filter((part) => part.length >= 3)
    .reverse();

  for (const part of spaceParts) {
    if (!candidates.includes(part)) {
      candidates.push(part);
    }
  }

  return candidates;
}

function buildForecastParams(latitude, longitude) {
  return {
    latitude,
    longitude,
    timezone: "auto",
    forecast_days: 7,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "rain",
      "showers",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
    ].join(","),
  };
}

export async function searchCities(query) {
  const candidates = buildSearchCandidates(query);

  for (const candidate of candidates) {
    const { data } = await geocodingClient.get("/search", {
      params: {
        name: candidate,
        count: 5,
        language: "en",
        format: "json",
      },
    });

    const results = data?.results ?? [];

    if (results.length > 0) {
      return {
        results,
        matchedQuery: candidate,
      };
    }
  }

  return {
    results: [],
    matchedQuery: null,
  };
}

export async function reverseGeocode(latitude, longitude) {
  const { data } = await axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: {
      format: "jsonv2",
      lat: latitude,
      lon: longitude,
      zoom: 10,
      addressdetails: 1,
    },
    headers: {
      Accept: "application/json",
    },
    timeout: 12000,
  });

  const address = data?.address ?? {};
  const cityName =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.suburb ??
    address.county ??
    address.state_district ??
    null;

  if (!cityName && !data?.display_name) {
    return null;
  }

  return {
    name: cityName ?? data.display_name,
    admin1: address.state ?? address.state_district ?? address.county ?? null,
    country: address.country ?? null,
    latitude: Number(data?.lat ?? latitude),
    longitude: Number(data?.lon ?? longitude),
  };
}

export async function getForecast(latitude, longitude) {
  const cacheKey = getForecastCacheKey(latitude, longitude);
  const cachedEntry = forecastCache.get(cacheKey);

  if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
    return cachedEntry.promise ?? cachedEntry.value;
  }

  const requestPromise = forecastClient
    .get("/forecast", {
      params: buildForecastParams(latitude, longitude),
    })
    .then(({ data }) => {
      forecastCache.set(cacheKey, {
        value: data,
        expiresAt: Date.now() + FORECAST_CACHE_TTL,
      });

      return data;
    })
    .catch((error) => {
      forecastCache.delete(cacheKey);
      throw error;
    });

  forecastCache.set(cacheKey, {
    promise: requestPromise,
    expiresAt: Date.now() + FORECAST_CACHE_TTL,
  });

  return requestPromise;
}

export async function saveSearchHistory(search) {
  const payload =
    typeof search === "string"
      ? { searchQuery: search }
      : {
          searchQuery: search?.searchQuery,
          searchType: search?.searchType,
          resolvedName: search?.resolvedName,
          weather: search?.weather,
        };

  const normalizedQuery = payload.searchQuery?.trim();

  if (!normalizedQuery) {
    return null;
  }

  const { data } = await axios.post(getApiUrl("/api/history"), {
    ...payload,
    searchQuery: normalizedQuery,
  });

  return data;
}