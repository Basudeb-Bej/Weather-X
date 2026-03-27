import axios from "axios";

const geocodingClient = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
  timeout: 12000,
});

const forecastClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 12000,
});

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
  const { data } = await geocodingClient.get("/reverse", {
    params: {
      latitude,
      longitude,
      language: "en",
      format: "json",
    },
  });

  return data?.results?.[0] ?? null;
}

export async function getForecast(latitude, longitude) {
  const { data } = await forecastClient.get("/forecast", {
    params: buildForecastParams(latitude, longitude),
  });

  return data;
}

export async function saveSearchHistory(city) {
  const normalizedCity = city?.trim();

  if (!normalizedCity) {
    return null;
  }

  const { data } = await axios.post("/api/history", {
    city: normalizedCity,
  });

  return data;
}