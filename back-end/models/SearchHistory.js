const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("SearchHistory", searchHistorySchema);