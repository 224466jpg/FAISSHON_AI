import Analysis from '../models/Analysis.js';
import Outfit from '../models/Outfit.js';
import { analyzeOutfitWithAI } from '../services/aiService.js';

export async function analyzeOutfit(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an outfit image using the outfitImage field.',
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const aiResult = await analyzeOutfitWithAI({ imageUrl });

    let savedOutfit = null;
    let savedAnalysis = null;

    try {
      savedOutfit = await Outfit.create({
        imageUrl,
        title: req.body.title || 'Uploaded outfit',
        occasion: aiResult.occasion,
        styleScore: aiResult.outfitScore,
        tags: ['ai-analysis', aiResult.colorMatch, aiResult.occasion].filter(Boolean),
      });

      savedAnalysis = await Analysis.create({
        outfitId: savedOutfit._id,
        imageUrl,
        outfitScore: aiResult.outfitScore,
        score: aiResult.outfitScore,
        status: aiResult.colorMatch,
        vibe: aiResult.occasion,
        colorMatch: aiResult.colorMatch,
        occasion: aiResult.occasion,
        fitSuggestion: aiResult.fitSuggestion,
        tips: aiResult.tips,
        recommendations: aiResult.recommendations,
      });
    } catch (databaseError) {
      console.warn('Database save skipped:', databaseError.message);
    }

    res.json({
      success: true,
      message: 'Outfit analyzed successfully',
      data: {
        id: savedAnalysis?._id || `demo-${Date.now()}`,
        outfitId: savedOutfit?._id || null,
        ...aiResult,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnalysisHistory(req, res, next) {
  try {
    const analyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(Number(req.query.limit) || 20)
      .lean();

    res.json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    res.json({
      success: true,
      data: [],
      message: 'Database not connected - history unavailable',
    });
  }
}

export async function getAnalysisById(req, res, next) {
  try {
    const analysis = await Analysis.findById(req.params.id).lean();

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found',
      });
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
}
