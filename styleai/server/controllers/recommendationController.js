import Recommendation from '../models/Recommendation.js';
import { getOccasionRecommendations } from '../services/aiService.js';

export async function analyzeOutfit(req, res, next) {
  try {
    res.json({
      success: true,
      message: 'Use /api/analysis/upload for image analysis. This route is kept for compatibility.',
      data: {
        recommendations: getOccasionRecommendations(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendations(req, res, next) {
  try {
    let saved = [];

    try {
      saved = await Recommendation.find()
        .sort({ createdAt: -1 })
        .limit(Number(req.query.limit) || 20)
        .lean();
    } catch (databaseError) {
      console.warn('Recommendation database read skipped:', databaseError.message);
    }

    res.json({
      success: true,
      data: saved.length > 0 ? saved : getOccasionRecommendations(),
    });
  } catch (error) {
    next(error);
  }
}

export async function getTrending(req, res, next) {
  try {
    res.json({
      success: true,
      data: getOccasionRecommendations().slice(0, 3),
    });
  } catch (error) {
    next(error);
  }
}

export async function saveRecommendation(req, res, next) {
  try {
    const recommendation = await Recommendation.create({
      userId: req.body.userId || 'anonymous',
      style: req.body.style || 'Minimalist Chic',
      occasion: req.body.occasion || 'Casual',
      analysis: req.body.analysis || 'Saved recommendation for later styling.',
      suggestions: req.body.suggestions || [],
      improvements: req.body.improvements || [],
      isTrending: false,
      likes: 1,
    });

    res.status(201).json({
      success: true,
      message: 'Recommendation saved successfully',
      data: recommendation,
    });
  } catch (error) {
    next(error);
  }
}
