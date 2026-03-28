const mongoose = require("mongoose");

let databaseConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    databaseConnected = false;
    console.error(
      "MONGODB_URI is not defined in back-end/.env. " +
      "Search history will be unavailable. " +
      "Set MONGODB_URI=<your-connection-string> to enable persistence."
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    databaseConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    databaseConnected = false;
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error(
      "Search history will be unavailable. " +
      "Verify your MONGODB_URI, Atlas credentials, and network access settings."
    );
    return false;
  }
};

const isDatabaseConnected = () => databaseConnected && mongoose.connection.readyState === 1;

module.exports = {
  connectDB,
  isDatabaseConnected,
};
