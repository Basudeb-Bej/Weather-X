const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.error(
        "Server starting WITHOUT database connectivity. " +
        "Search history endpoints will return 503 until MongoDB is configured."
      );
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
