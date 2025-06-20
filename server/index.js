import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/games.js';
import authRoutes from './routes/auth.js';

dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares - put cors and express.json BEFORE routes!
app.use(cors({
  origin: 'http://localhost:3000',  // frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Routes - after middleware
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error('Mongo error:', err));
