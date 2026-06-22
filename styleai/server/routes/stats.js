import express from 'express';
import { getStats } from '../controllers/statsController.js';

const router = express.Router();

// GET /api/stats - Get platform statistics
router.get('/', getStats);

export default router;
