require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
let MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({
    message: 'Expenses Management API is running!',
    databaseStatus: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Connecting...',
    mongoUri: MONGO_URI.startsWith('mongodb+srv') ? 'MongoDB Atlas (Cloud)' : 'Local / Embedded MongoDB'
  });
});

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const isCloud = MONGO_URI.startsWith('mongodb+srv://');
    console.log(`Connecting to ${isCloud ? 'MongoDB Atlas (Cloud)' : 'MongoDB (' + MONGO_URI + ')'}...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`✓ Successfully connected to MongoDB! [Host: ${mongoose.connection.host}, Database: ${mongoose.connection.name}]`);
  } catch (err) {
    console.error('✗ Failed to connect to MongoDB:', err.message);
    if (MONGO_URI.includes('127.0.0.1') || MONGO_URI.includes('localhost')) {
      console.log('ℹ️  Local MongoDB is not running on port 27017.');
      console.log('   You can provide a MongoDB Atlas cloud URI in server/.env or start your local MongoDB service.\n');
    }
  }
};

// Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
