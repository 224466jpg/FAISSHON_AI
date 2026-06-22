import express from 'express';

const router = express.Router();
const messages = [];

router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required.',
    });
  }

  const savedMessage = {
    id: `contact-${Date.now()}`,
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  messages.unshift(savedMessage);

  res.status(201).json({
    success: true,
    message: 'Message received successfully.',
    data: savedMessage,
  });
});

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: messages,
  });
});

export default router;
