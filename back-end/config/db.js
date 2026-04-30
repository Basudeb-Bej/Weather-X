const mongoose = require("mongoose");

let databaseConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    databaseConnected = false;
    console.log("MONGODB_URI is not set. Using in-memory history fallback.");
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    databaseConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    databaseConnected = false;
    console.warn(`MongoDB unavailable, using in-memory history fallback: ${error.message}`);
  }
};

const isDatabaseConnected = () => databaseConnected || mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isDatabaseConnected = isDatabaseConnected;