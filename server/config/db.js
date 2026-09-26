const mongoose = require('mongoose');

let memServer = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  // 1. Try connecting to MongoDB Atlas or local MongoDB if configured
  if (mongoURI && !mongoURI.includes('YOUR_MONGODB_ATLAS_CONNECTION_STRING')) {
    try {
      console.log(`[MongoDB Connection] Connecting to MongoDB...`);
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 4000
      });
      console.log(`✅ [MongoDB Connected Successfully]: Host -> ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`⚠️ [Primary MongoDB Connection Failed]: ${error.message}`);
    }
  }

  // 2. In-Memory Database Fallback for Instant Development & Testing
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('🚀 [MongoDB Fallback] Starting In-Memory MongoDB server for instant out-of-the-box development...');
    memServer = await MongoMemoryServer.create();
    const memUri = memServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`✅ [In-Memory MongoDB Ready]: Host -> ${conn.connection.host}`);
    console.log(`💡 NOTE: To connect to MongoDB Atlas permanently, paste your connection string in server/.env MONGO_URI`);
  } catch (memError) {
    console.error('❌ CRITICAL ERROR: Could not connect to MongoDB Atlas, local MongoDB, or In-Memory MongoDB.');
    console.error('Please update server/.env MONGO_URI with your MongoDB Atlas connection string.');
  }
};

module.exports = connectDB;
