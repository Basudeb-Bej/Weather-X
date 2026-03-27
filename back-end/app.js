const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { logger } = require("./middleware/logger");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");
const weatherRoutes = require("./routes/weatherRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(logger);
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Weather API is running",
  });
});

app.use("/api/weather", weatherRoutes);
app.use("/api/history", historyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;