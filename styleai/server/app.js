import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import analysisRoutes from './routes/analysis.js';
import statsRoutes from './routes/stats.js';
import recommendationRoutes from './routes/recommendation.js';
import authRoutes from './routes/auth.js';
import outfitRoutes from './routes/outfits.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orders.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Created uploads directory at: ${uploadsDir}`);
}

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  'https://faisshon-ai-8.onrender.com',
];
const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGIN?.split(',') || []),
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/$/, ''));
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

export function createApiApp() {
  const app = express();

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({
    origin(origin, callback) {
      if (
        !origin || 
        allowedOrigins.includes(origin.replace(/\/$/, '')) || 
        origin.replace(/\/$/, '').endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
  }));
  app.use(compression());
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'Fashion AI Stylist API is running',
      database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  app.use('/api/analysis', analysisRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/outfits', outfitRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api', recommendationRoutes);

  app.use(errorHandler);

  return app;
}
