import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();
const demoOrders = [];

router.post('/', async (req, res, next) => {
  try {
    const { customer, items, subtotal = 0, stylingFee = 0, total = 0 } = req.body;

    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and address are required to place an order.',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.',
      });
    }

    const payload = {
      customer,
      items,
      subtotal,
      stylingFee,
      total,
      status: 'Placed',
    };

    let order;

    try {
      order = await Order.create(payload);
    } catch (databaseError) {
      order = {
        _id: `demo-order-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      demoOrders.unshift(order);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(30).lean();
    res.json({ success: true, data: [...demoOrders, ...orders] });
  } catch {
    res.json({ success: true, data: demoOrders });
  }
});

export default router;
