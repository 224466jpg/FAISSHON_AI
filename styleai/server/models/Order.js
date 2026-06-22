import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  category: String,
  price: String,
  quantity: Number,
  image: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [orderItemSchema],
  subtotal: Number,
  stylingFee: Number,
  total: Number,
  status: {
    type: String,
    default: 'Placed',
  },
}, {
  timestamps: true,
});

orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
