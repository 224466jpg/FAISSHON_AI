import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyzeOutfit,
  getRecommendations,
  getTrending,
  saveRecommendation
} from '../controllers/recommendationController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Relative path to styleai/server/uploads
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `outfit-${uniqueSuffix}${ext}`);
  }
});

// Configure upload limits and filters
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed.'));
  }
});

const router = express.Router();

// POST /api/analyze-outfit - Analyze outfit (accepts multipart/form-data upload or JSON base64)
router.post('/analyze-outfit', rateLimiter, upload.single('image'), analyzeOutfit);

// GET /api/recommendations - Get all saved recommendations
router.get('/recommendations', getRecommendations);

// GET /api/trending - Get trending recommendations
router.get('/trending', getTrending);

// POST /api/save-recommendation - Save/bookmark a recommendation
router.post('/save-recommendation', saveRecommendation);

export default router;
