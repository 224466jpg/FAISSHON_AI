require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');

const PORT = process.env.PORT || 5000;
const distPath = path.join(__dirname, 'styleai', 'dist');

async function startServer() {
  const { createApiApp } = await import('./styleai/server/app.js');
  const { connectDB } = await import('./styleai/server/config/database.js');

  await connectDB();

  const app = createApiApp();

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({
          success: false,
          message: 'Route not found',
        });
      }

      return res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.warn('⚠️  Frontend dist not found. Only API routes are available.');
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    });
  }

  app.listen(PORT, () => {
    console.log(`Fashion AI full-stack server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
