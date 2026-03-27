const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [120, "City is too long"],
      index: true,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model("SearchHistory", searchHistorySchema);