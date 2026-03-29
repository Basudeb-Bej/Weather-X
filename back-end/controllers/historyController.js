const asyncHandler = require("../middleware/asyncHandler");
const SearchHistory = require("../models/SearchHistory");
const { isDatabaseConnected } = require("../config/db");

const getHistory = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    res.json({
      success: true,
      results: 0,
      data: [],
      message: "Search history is unavailable until MongoDB is configured.",
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
  if (!isDatabaseConnected()) {
    res.status(503).json({
      success: false,
      message: "Search history is unavailable until MongoDB is configured.",
    });
    return;
  }

  const { city } = req.body;
  const history = await SearchHistory.create({ city });

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