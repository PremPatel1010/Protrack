import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import roadmapRoutes from './routes/roadmapRoute.js';
import morgan from 'morgan';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));
// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('ProTrack Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));