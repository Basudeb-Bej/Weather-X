const express = require("express");
const { body } = require("express-validator");

const validateRequest = require("../middleware/validateRequest");
const { getHistory, createHistory } = require("../controllers/historyController");

const router = express.Router();

const cityValidator = [
  body("city")
    .trim()
    .notEmpty()
    .withMessage("city is required")
    .isLength({ max: 120 })
    .withMessage("city is too long"),
];

router.get("/", getHistory);
router.post("/", cityValidator, validateRequest, createHistory);

module.exports = router;