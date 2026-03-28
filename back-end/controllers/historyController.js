const asyncHandler = require("../middleware/asyncHandler");
const SearchHistory = require("../models/SearchHistory");

const getHistory = asyncHandler(async (req, res) => {
  const history = await SearchHistory.find().sort({ searchedAt: -1 }).lean();

  res.json({
    success: true,
    results: history.length,
    data: history,
  });
});

const createHistory = asyncHandler(async (req, res) => {
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