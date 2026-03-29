const mongoose = require("mongoose");

let databaseConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
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