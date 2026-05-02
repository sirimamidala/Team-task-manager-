const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('No MONGO_URI found, starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create({
        instance: {
          launchTimeoutMS: 30000,
        },
      });
      mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log(`MongoDB successfully connected: ${mongoUri.includes('127.0.0.1') ? 'In-Memory' : 'Remote'}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Don't exit immediately, maybe retry or wait
    setTimeout(() => process.exit(1), 5000);
  }
};

module.exports = connectDB;
