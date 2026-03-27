const asyncHandler = require("../middleware/asyncHandler");
const { buildWeatherResponse } = require("../utils/weatherFormatter");
const { getWeatherByCity, getWeatherByCoordinates } = require("../utils/weatherService");
const SearchHistory = require("../models/SearchHistory");

async function saveSearch(city) {
  await SearchHistory.create({ city });
}

const getCurrentWeather = asyncHandler(async (req, res) => {
  const { city } = req.query;
  const payload = await getWeatherByCity(city);
  const formatted = buildWeatherResponse(payload);

  await saveSearch(formatted.location.city);

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

  await saveSearch(formatted.location.city);

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

  await saveSearch(formatted.location.city);

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