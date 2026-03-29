const asyncHandler = require("../middleware/asyncHandler");
const SearchHistory = require("../models/SearchHistory");
const { isDatabaseConnected } = require("../config/db");
const { getDisplayClientIp } = require("../utils/requestMeta");
const { listHistory, saveHistory } = require("../utils/historyStore");

function buildHistoryPayload(req) {
  const searchQuery = String(req.body.searchQuery ?? req.body.city ?? "").trim();

  return {
    searchedBy: {
      ipAddress: getDisplayClientIp(req),
      userAgent: req.get("user-agent") ?? null,
      userId: req.body.userId ?? null,
    },
    searchedFor: {
      query: searchQuery,
      type: req.body.searchType === "location" ? "location" : "city",
      resolvedName: req.body.resolvedName ?? req.body.city ?? searchQuery,
    },
    weather: {
      condition: req.body.weather?.condition ?? req.body.weatherCondition ?? null,
      code: req.body.weather?.code ?? req.body.weatherCode ?? null,
      temperature: req.body.weather?.temperature ?? null,
      feelsLike: req.body.weather?.feelsLike ?? null,
      humidity: req.body.weather?.humidity ?? null,
      windSpeed: req.body.weather?.windSpeed ?? null,
      precipitation: req.body.weather?.precipitation ?? null,
    },
  };
}

const getHistory = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const fallbackHistory = listHistory();

    res.json({
      success: true,
      results: fallbackHistory.length,
      data: fallbackHistory,
      message: "Search history is stored in memory until MongoDB is available.",
    });
    return;
  }

  const history = await SearchHistory.find().sort({ searchedAt: -1 }).lean();

  res.json({
    success: true,
    results: history.length,
    data: history,
  });
});

const createHistory = asyncHandler(async (req, res) => {
  const payload = buildHistoryPayload(req);

  if (!isDatabaseConnected()) {
    const history = saveHistory(payload);

    res.status(503).json({
      success: true,
      message: "Search history saved in memory until MongoDB is available.",
      data: history,
    });
    return;
  }

  const history = await SearchHistory.create(payload);

  res.status(201).json({
    success: true,
    message: "Search history saved",
    data: history,
  });
});

module.exports = {
  getHistory,
  createHistory,
};