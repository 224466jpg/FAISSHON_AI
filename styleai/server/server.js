import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import analysisRoutes from './routes/analysis.js';
import statsRoutes from './routes/stats.js';
import recommendationRoutes from './routes/recommendation.js';
import authRoutes from './routes/auth.js';
import outfitRoutes from './routes/outfits.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orders.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Created uploads directory at: ${uploadsDir}`);
}

const app = express();
const PORT = process.env.PORT || 5000;
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];
const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGIN?.split(',') || [])
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/$/, ''));
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Fashion AI Stylist API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', recommendationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   Fashion AI Stylist API Server              ║
║                                               ║
║   Status: RUNNING                             ║
║   Port: ${PORT}                                   ║
║   Environment: ${process.env.NODE_ENV}                  ║
║   Time: ${new Date().toLocaleString()}        ║
║                                               ║
║   Endpoints:                                  ║
║   - GET  /api/health                          ║
║   - POST /api/analysis/upload                 ║
║   - GET  /api/analysis/history                ║
║   - GET  /api/analysis/:id                    ║
║   - POST /api/auth/register                   ║
║   - POST /api/auth/login                      ║
║   - GET  /api/outfits                         ║
║   - POST /api/outfits                         ║
║   - POST /api/contact                         ║
║   - GET  /api/orders                          ║
║   - POST /api/orders                          ║
║   - GET  /api/stats                           ║
║   - POST /api/analyze-outfit                  ║
║   - GET  /api/recommendations                 ║
║   - GET  /api/trending                        ║
║   - POST /api/save-recommendation             ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

export default app;
