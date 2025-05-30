const mongoose = require("mongoose");

// Connection cache
let cachedDb = null;

/**
 * Connect to MongoDB database
 * @returns {Promise<Object>} Mongoose connection
 */
const connectToDatabase = async () => {
  // If we already have a connection, use it
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using existing database connection");
    return cachedDb;
  }

  // Otherwise create a new connection
  try {
    console.log("Creating new database connection");

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable not set");
    }

    // Remove deprecated options
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
      socketTimeoutMS: 45000, // How long the socket can be idle before closing
      connectTimeoutMS: 10000, // How long to wait for server selection
    });

    cachedDb = connection;
    console.log("Database connection established");
    return cachedDb;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

module.exports = {
  connectToDatabase,
};
