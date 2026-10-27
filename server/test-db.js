require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('✗ No MONGO_URI found in server/.env');
  process.exit(1);
}

console.log('Connecting to MongoDB using URI from .env...');
console.log(`URI target: ${uri.replace(/:\/\/[^:]+:[^@]+@/, '://<credentials>@')}`);

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✓ Successfully connected to MongoDB!');
    console.log(`  Database Host: ${mongoose.connection.host}`);
    console.log(`  Database Name: ${mongoose.connection.name}`);
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('Connection closed cleanly.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });
