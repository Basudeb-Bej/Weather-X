const axios = require("axios");
const AppError = require("./AppError");
const { getCacheKey, getCachedValue, setCachedValue } = require("./cache");

const geocodingClient = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
  timeout: 12000,
});

const forecastClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 12000,
});

function forecastParams(latitude, longitude) {
  return {
    latitude,
    longitude,
    timezone: "auto",
    forecast_days: 7,
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    hourly: ["temperature_2m", "weather_code", "precipitation_probability"].join(","),
    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min", "precipitation_sum"].join(","),
  };
}

async function geocodeCity(city) {
  const cacheKey = getCacheKey("geocode", { city });
  const cached = getCachedValue(cacheKey);

  if (cached) {
    return cached;
  }

  const { data } = await geocodingClient.get("/search", {
    params: {
      name: city,
      count: 1,
      language: "en",
      format: "json",
    },
  });

  const result = data?.results?.[0];

  if (!result) {
    throw new AppError(`City not found: ${city}`, 404);
  }

  setCachedValue(cacheKey, result);
  return result;
}

async function reverseGeocode(latitude, longitude) {
  const cacheKey = getCacheKey("reverse-geocode", { latitude, longitude });
  const cached = getCachedValue(cacheKey);

  if (cached) {
    return cached;
  }

  const { data } = await geocodingClient.get("/reverse", {
    params: {
      latitude,
      longitude,
      language: "en",
      format: "json",
    },
  });

  const result = data?.results?.[0];

  if (!result) {
    throw new AppError("Unable to resolve location from coordinates", 404);
  }

  setCachedValue(cacheKey, result);
  return result;
}

async function fetchWeather(latitude, longitude) {
  const cacheKey = getCacheKey("weather", { latitude, longitude });
  const cached = getCachedValue(cacheKey);

  if (cached) {
    return cached;
  }

  const { data } = await forecastClient.get("/forecast", {
    params: forecastParams(latitude, longitude),
  });

  setCachedValue(cacheKey, data);
  return data;
}

async function getWeatherByCity(city) {
  const location = await geocodeCity(city);
  const forecast = await fetchWeather(location.latitude, location.longitude);

  return { location, forecast };
}

async function getWeatherByCoordinates(latitude, longitude) {
  const location = await reverseGeocode(latitude, longitude);
  const forecast = await fetchWeather(latitude, longitude);

  return { location, forecast };
}

module.exports = {
  geocodeCity,
  reverseGeocode,
  fetchWeather,
  getWeatherByCity,
  getWeatherByCoordinates,
};