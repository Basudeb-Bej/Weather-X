const mongoose = require("mongoose");

let databaseConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    databaseConnected = false;
    console.warn("MONGODB_URI is not defined. Search history features will be disabled.");
    console.warn("Set MONGODB_URI to your MongoDB Atlas connection string to enable search history.");
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    databaseConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    databaseConnected = false;
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error("Search history features will be disabled, but the server will continue starting.");
    console.error("Troubleshooting tips:");
    console.error("  1. Ensure MONGODB_URI is set correctly in your environment variables.");
    console.error("  2. In MongoDB Atlas, go to Network Access and allow 0.0.0.0/0 (or your host's IP).");
    console.error("  3. Verify the username, password, and cluster name in the connection string.");
    return false;
  }
};

mongoose.connection.on("disconnected", () => {
  databaseConnected = false;
  console.warn("MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  databaseConnected = true;
  console.log("MongoDB reconnected.");
});

const isDatabaseConnected = () => databaseConnected && mongoose.connection.readyState === 1;

module.exports = {
  connectDB,
  isDatabaseConnected,
};
