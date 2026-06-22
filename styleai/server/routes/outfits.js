import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Outfit from '../models/Outfit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `wardrobe-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
const router = express.Router();
const demoOutfits = [];

router.get('/', async (req, res) => {
  try {
    const outfits = await Outfit.find().sort({ createdAt: -1 }).limit(30).lean();
    res.json({ success: true, data: [...demoOutfits, ...outfits] });
  } catch (error) {
    res.json({ success: true, data: demoOutfits, message: 'Using demo wardrobe storage.' });
  }
});

router.post('/', upload.single('outfitImage'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Upload an outfit image.' });
    }

    const payload = {
      title: req.body.title || 'Saved outfit',
      imageUrl: `/uploads/${req.file.filename}`,
      occasion: req.body.occasion || 'Everyday',
      tags: req.body.tags ? String(req.body.tags).split(',').map((tag) => tag.trim()) : [],
    };

    let outfit;

    try {
      outfit = await Outfit.create(payload);
    } catch (databaseError) {
      outfit = {
        _id: `demo-outfit-${Date.now()}`,
        ...payload,
        styleScore: 84,
        createdAt: new Date().toISOString(),
      };
      demoOutfits.unshift(outfit);
    }

    res.status(201).json({ success: true, data: outfit });
  } catch (error) {
    next(error);
  }
});

export default router;
