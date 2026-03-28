const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 8000;

function logStartupConfig() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  console.log("--- Startup configuration ---");
  console.log(`  PORT:         ${PORT}`);
  console.log(`  MONGODB_URI:  ${mongoUri ? "set ✓" : "NOT SET ✗"}`);
  console.log(`  OPENWEATHER_API_KEY: ${process.env.OPENWEATHER_API_KEY ? "set ✓" : "NOT SET ✗"}`);
  console.log("-----------------------------");
}

async function startServer() {
  logStartupConfig();
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

void startServer();
