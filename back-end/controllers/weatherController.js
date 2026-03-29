const asyncHandler = require("../middleware/asyncHandler");
const { buildWeatherResponse } = require("../utils/weatherFormatter");
const { getWeatherByCity, getWeatherByCoordinates } = require("../utils/weatherService");
const SearchHistory = require("../models/SearchHistory");
const { isDatabaseConnected } = require("../config/db");
const { getDisplayClientIp } = require("../utils/requestMeta");
const { saveHistory } = require("../utils/historyStore");

async function saveSearch(payload) {
  const historyPayload = {
    searchedBy: {
      ipAddress: payload.ipAddress ?? null,
      userAgent: payload.userAgent ?? null,
      userId: payload.userId ?? null,
    },
    searchedFor: {
      query: payload.searchQuery,
      type: payload.searchType ?? "city",
      resolvedName: payload.resolvedName ?? payload.searchQuery,
    },
    weather: {
      condition: payload.weather?.condition ?? null,
      code: payload.weather?.code ?? null,
      temperature: payload.weather?.temperature ?? null,
      feelsLike: payload.weather?.feelsLike ?? null,
      humidity: payload.weather?.humidity ?? null,
      windSpeed: payload.weather?.windSpeed ?? null,
      precipitation: payload.weather?.precipitation ?? null,
    },
  };

  if (!isDatabaseConnected()) {
    saveHistory(historyPayload);
    return;
  }

  try {
    await SearchHistory.create(historyPayload);
  } catch (error) {
    saveHistory(historyPayload);
  }
}

const getCurrentWeather = asyncHandler(async (req, res) => {
  const { city } = req.query;
  const payload = await getWeatherByCity(city);
  const formatted = buildWeatherResponse(payload);

  await saveSearch({
    searchQuery: formatted.location.city,
    searchType: "city",
    resolvedName: formatted.location.city,
    weather: {
      condition: formatted.current.conditionLabel,
      code: formatted.current.weatherCode,
      temperature: formatted.current.temperature,
      feelsLike: formatted.current.feelsLike,
      humidity: formatted.current.humidity,
      windSpeed: formatted.current.windSpeed,
      precipitation: formatted.current.precipitation,
    },
    ipAddress: getDisplayClientIp(req),
    userAgent: req.get("user-agent"),
  });

  res.json({
    success: true,
    message: "Current weather fetched successfully",
    data: {
      location: formatted.location,
      current: formatted.current,
      metadata: formatted.metadata,
    },
  });
});

const getForecastWeather = asyncHandler(async (req, res) => {
  const { city } = req.query;
  const payload = await getWeatherByCity(city);
  const formatted = buildWeatherResponse(payload);

  await saveSearch({
    searchQuery: formatted.location.city,
    searchType: "city",
    resolvedName: formatted.location.city,
    weather: {
      condition: formatted.current.conditionLabel,
      code: formatted.current.weatherCode,
      temperature: formatted.current.temperature,
      feelsLike: formatted.current.feelsLike,
      humidity: formatted.current.humidity,
      windSpeed: formatted.current.windSpeed,
      precipitation: formatted.current.precipitation,
    },
    ipAddress: getDisplayClientIp(req),
    userAgent: req.get("user-agent"),
  });

  res.json({
    success: true,
    message: "Forecast fetched successfully",
    data: {
      location: formatted.location,
      current: formatted.current,
      hourly: formatted.hourly,
      forecast: formatted.forecast,
      metadata: formatted.metadata,
    },
  });
});

const getLocationWeather = asyncHandler(async (req, res) => {
  const latitude = Number(req.query.lat);
  const longitude = Number(req.query.lon);
  const payload = await getWeatherByCoordinates(latitude, longitude);
  const formatted = buildWeatherResponse(payload);

  await saveSearch({
    searchQuery: formatted.location.city,
    searchType: "location",
    resolvedName: formatted.location.city,
    weather: {
      condition: formatted.current.conditionLabel,
      code: formatted.current.weatherCode,
      temperature: formatted.current.temperature,
      feelsLike: formatted.current.feelsLike,
      humidity: formatted.current.humidity,
      windSpeed: formatted.current.windSpeed,
      precipitation: formatted.current.precipitation,
    },
    ipAddress: getDisplayClientIp(req),
    userAgent: req.get("user-agent"),
  });

  res.json({
    success: true,
    message: "Location weather fetched successfully",
    data: {
      location: formatted.location,
      current: formatted.current,
      hourly: formatted.hourly,
      forecast: formatted.forecast,
      metadata: formatted.metadata,
    },
  });
});

module.exports = {
  getCurrentWeather,
  getForecastWeather,
  getLocationWeather,
};