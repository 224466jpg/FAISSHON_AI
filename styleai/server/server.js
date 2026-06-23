import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import { createApiApp } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = createApiApp();

connectDB();

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   Fashion AI Stylist API Server              ║
║                                               ║
║   Status: RUNNING                             ║
║   Port: ${PORT}                                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}                  ║
║   Time: ${new Date().toLocaleString()}        ║
║                                               ║
║   Endpoints:                                  ║
║   - GET  /api/health                          ║
║   - POST /api/analysis/upload                 ║
║   - GET  /api/analysis/history                ║
║   - GET  /api/analysis/:id                    ║
║   - POST /api/auth/register                   ║
║   - POST /api/auth/login                      ║
║   - GET  /api/outfits                         ║
║   - POST /api/outfits                         ║
║   - POST /api/contact                         ║
║   - GET  /api/orders                          ║
║   - POST /api/orders                          ║
║   - GET  /api/stats                           ║
║   - POST /api/analyze-outfit                  ║
║   - GET  /api/recommendations                 ║
║   - GET  /api/trending                        ║
║   - POST /api/save-recommendation             ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

export default app;
