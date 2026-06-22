import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  title: {
    type: String,
    default: 'Saved outfit',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  occasion: {
    type: String,
    default: 'Everyday',
  },
  styleScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 85,
  },
  tags: [String],
}, {
  timestamps: true,
});

outfitSchema.index({ createdAt: -1 });

export default mongoose.model('Outfit', outfitSchema);
