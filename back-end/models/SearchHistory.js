const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    searchedBy: {
      ipAddress: {
        type: String,
        default: null,
        trim: true,
        maxlength: 120,
      },
      userAgent: {
        type: String,
        default: null,
        trim: true,
        maxlength: 255,
      },
      userId: {
        type: String,
        default: null,
        trim: true,
        maxlength: 120,
      },
    },
    searchedFor: {
      query: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },
      type: {
        type: String,
        enum: ["city", "location"],
        default: "city",
      },
      resolvedName: {
        type: String,
        default: null,
        trim: true,
        maxlength: 120,
      },
    },
    weather: {
      condition: {
        type: String,
        default: null,
        trim: true,
        maxlength: 120,
      },
      code: {
        type: Number,
        default: null,
      },
      temperature: {
        type: Number,
        default: null,
      },
      feelsLike: {
        type: Number,
        default: null,
      },
      humidity: {
        type: Number,
        default: null,
      },
      windSpeed: {
        type: Number,
        default: null,
      },
      precipitation: {
        type: Number,
        default: null,
      },
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