// db.js

const mongoose = require('mongoose');
const config = require('../config');

// MongoDB connection URI
//const uri = 'mongodb://localhost:27017/your_database_name';

async function connectToDatabase() {
  try {
    //await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(config.mongoURI);
    console.log('Successfully connected to MongoDB');

    // Set up event listeners
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };