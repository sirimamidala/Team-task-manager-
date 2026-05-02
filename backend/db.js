const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        launchTimeoutMS: 30000,
      },
    });
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log(`MongoDB successfully connected to in-memory server: ${mongoUri}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
