const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.warn("Search history storage is unavailable. Set MONGODB_URI in back-end/.env to enable it.");
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

void startServer();
