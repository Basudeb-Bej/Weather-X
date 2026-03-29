const express = require("express");
const { body } = require("express-validator");

const validateRequest = require("../middleware/validateRequest");
const { getHistory, createHistory } = require("../controllers/historyController");

const router = express.Router();

const historyValidator = [
  body().custom((_, { req }) => {
    const searchQuery = String(req.body.searchQuery ?? req.body.city ?? "").trim();

    if (!searchQuery) {
      throw new Error("searchQuery is required");
    }

    return true;
  }),
  body("searchType")
    .optional()
    .isIn(["city", "location"])
    .withMessage("searchType must be city or location"),
  body("weather.condition").optional().isLength({ max: 120 }).withMessage("weather condition is too long"),
  body("weather.code").optional().isNumeric().withMessage("weather code must be a number"),
  body("weather.temperature").optional().isNumeric().withMessage("weather temperature must be a number"),
  body("weather.feelsLike").optional().isNumeric().withMessage("weather feelsLike must be a number"),
  body("weather.humidity").optional().isNumeric().withMessage("weather humidity must be a number"),
  body("weather.windSpeed").optional().isNumeric().withMessage("weather windSpeed must be a number"),
  body("weather.precipitation").optional().isNumeric().withMessage("weather precipitation must be a number"),
];

router.get("/", getHistory);
router.post("/", historyValidator, validateRequest, createHistory);

module.exports = router;