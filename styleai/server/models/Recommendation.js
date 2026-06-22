import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'anonymous'
  },
  imageUrl: String,
  style: String,
  colors: [String],
  occasion: String,
  analysis: String,
  suggestions: [{
    item: String,
    category: String,
    description: String,
    price: String,
    imageUrl: String
  }],
  accessories: [String],
  improvements: [String],
  isTrending: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

recommendationSchema.index({ createdAt: -1 });
recommendationSchema.index({ isTrending: 1 });

export default mongoose.model('Recommendation', recommendationSchema);
