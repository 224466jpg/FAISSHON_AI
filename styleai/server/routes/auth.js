import express from 'express';
import User from '../models/User.js';

const router = express.Router();
const demoUsers = [];

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    let user;

    try {
      user = await User.create({
        name,
        email,
        passwordHash: `replace-with-bcrypt-${password.length}`,
      });
    } catch (databaseError) {
      user = {
        _id: `demo-user-${Date.now()}`,
        name,
        email,
      };
      demoUsers.push(user);
    }

    res.status(201).json({
      success: true,
      message: 'User registered. Add bcrypt and JWT before production.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  res.json({
    success: true,
    message: 'Authentication-ready route. Add password verification and JWT signing here.',
    data: {
      email: req.body.email,
      token: 'demo-token-replace-with-jwt',
    },
  });
});

export default router;
