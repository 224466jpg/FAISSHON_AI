import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  outfitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Outfit',
    required: false,
  },
  imageUrl: String,
  outfitScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 85,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 85,
  },
  status: {
    type: String,
    default: 'Good',
  },
  vibe: {
    type: String,
    default: 'Casual / College',
  },
  colorMatch: String,
  occasion: String,
  fitSuggestion: String,
  tips: [String],
  recommendations: [String],
}, {
  timestamps: true,
});

analysisSchema.index({ createdAt: -1 });
analysisSchema.index({ outfitScore: -1 });

export default mongoose.model('Analysis', analysisSchema);
