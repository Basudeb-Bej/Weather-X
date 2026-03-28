const express = require("express");
const { query } = require("express-validator");

const validateRequest = require("../middleware/validateRequest");
const { getCurrentWeather, getForecastWeather, getLocationWeather } = require("../controllers/weatherController");

const router = express.Router();

const cityValidator = [
  query("city")
    .trim()
    .notEmpty()
    .withMessage("city is required")
    .isLength({ max: 120 })
    .withMessage("city is too long"),
];

const coordinatesValidator = [
  query("lat")
    .notEmpty()
    .withMessage("lat is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("lat must be a valid latitude"),
  query("lon")
    .notEmpty()
    .withMessage("lon is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("lon must be a valid longitude"),
];

router.get("/current", cityValidator, validateRequest, getCurrentWeather);
router.get("/forecast", cityValidator, validateRequest, getForecastWeather);
router.get("/location", coordinatesValidator, validateRequest, getLocationWeather);

module.exports = router;