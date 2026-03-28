const mongoose = require("mongoose");

let databaseConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    databaseConnected = false;
    console.warn("MONGODB_URI is not defined. Search history features will be disabled.");
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    databaseConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    databaseConnected = false;
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn("Search history features will be disabled, but the server will continue starting.");
    return false;
  }
};

const isDatabaseConnected = () => databaseConnected && mongoose.connection.readyState === 1;

module.exports = {
  connectDB,
  isDatabaseConnected,
};
