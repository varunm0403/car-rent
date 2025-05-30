import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import { errorHandler } from './middlewares/error.middleware';
import app from './app';
dotenv.config();

// Connect to MongoDB
connectDB();

// const app = express();

// Middleware
app.use(express.json());

// Error handler
app.use(errorHandler);

// Routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Car booking Server is running on port ${PORT}`);
});