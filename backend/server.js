import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import roadmapRoutes from './routes/roadmapRoute.js';
import morgan from 'morgan';

dotenv.config();

const app = express();

// Add these right after imports
const __dirname = path.resolve();
// Middleware
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));
// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);



// Add this after all your API routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist",'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

