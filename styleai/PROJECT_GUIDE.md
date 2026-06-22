# 🚀 STYLEAI - Complete Full-Stack Setup Guide

## Project Overview

STYLEAI is a full-stack AI-powered fashion analysis platform with:
- **Frontend**: React 19 + Vite + Tailwind CSS (Neo-Brutalist Design)
- **Backend**: Express.js + MongoDB + Groq AI (LLaMA 3.3 70B)
- **AI**: Real-time outfit analysis with personalized recommendations

---

## 🏗️ Architecture

```
styleai/
├── src/                    # React Frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components (Home, FitCheck)
│   ├── services/          # API integration services
│   └── App.jsx            # Main app with routing
├── server/                # Express Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic (Groq AI)
│   └── server.js          # Main server file
└── public/                # Static assets
```

---

## 📋 Prerequisites

Before you start, ensure you have:

- ✅ **Node.js 18+** and npm
- ✅ **MongoDB** (local or cloud)
- ✅ **Groq API Key** (already configured: `your_groq_api_key_here`)

---

## 🚦 Quick Start

### Step 1: Install Dependencies

#### Frontend:
```bash
cd styleai
npm install
```

#### Backend:
```bash
cd styleai/server
npm install
```

### Step 2: Start MongoDB

#### Option A: Local MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `server/.env` file: `MONGODB_URI=your_connection_string`

### Step 3: Start Backend Server

```bash
cd server
npm run dev
```

✅ Server running at: **http://localhost:5000**

### Step 4: Start Frontend Dev Server

```bash
cd ..  # Back to styleai directory
npm run dev
```

✅ Frontend running at: **http://localhost:5173** (or 5175)

---

## 🔑 Environment Variables

### Frontend (`.env`)
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GROQ_MODEL=llama-3.3-70b-versatile
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/styleai
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

---

## 🎯 How to Use

### 1. Home Page
- Browse style collections
- Explore different aesthetics (Weekend, Rave, Street)
- Click **"TRY FIT CHECK AI"** button

### 2. Fit Check Page
1. **Upload**: Drag & drop or click to select outfit photo
2. **Analyze**: Click "⚡ ANALYZE FIT" button
3. **Results**: View AI-powered analysis including:
   - Overall score (0-100)
   - Status badge (ELITE, FIRE, SOLID, MID, NEEDS WORK)
   - Color palette extraction
   - Silhouette, coordination, and X-factor ratings
   - Personalized recommendations
   - Outfit suggestions for different occasions

### 3. API Endpoints

Test backend directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Get platform stats
curl http://localhost:5000/api/stats

# Get analysis history
curl http://localhost:5000/api/analysis/history
```

---

## 🎨 Features

### Frontend Features
- ⚡ **Lightning Fast**: Vite build tool
- 🎨 **Neo-Brutalist Design**: Bold colors, thick borders, dramatic shadows
- 📱 **Fully Responsive**: Mobile-first design
- 🔄 **Real-time Preview**: Instant image preview before analysis
- 📸 **Drag & Drop**: Easy image upload
- 🚀 **Smooth Animations**: Professional transitions and effects

### Backend Features
- 🤖 **AI Integration**: Groq's LLaMA 3.3 70B model
- 💾 **Persistent Storage**: MongoDB for analysis history
- 🔒 **Rate Limiting**: 10 requests per 15 minutes
- 📊 **Statistics API**: Platform-wide analytics
- 🛡️ **Security**: Helmet.js, CORS, input validation
- ⚡ **Performance**: Compression, optimized queries
- 🔄 **Fallback**: Works even if AI/DB is unavailable

---

## 🧪 Testing

### Test Frontend
```bash
# In styleai directory
npm run dev
# Visit http://localhost:5173
```

### Test Backend API
```bash
# In styleai/server directory
npm run dev

# Test health endpoint
curl http://localhost:5000/api/health

# Test with sample analysis (Postman or curl)
curl -X POST http://localhost:5000/api/analysis/upload \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/png;base64,iVBORw0..."}'
```

---

## 📦 Build for Production

### Frontend
```bash
cd styleai
npm run build
npm run preview  # Test production build
```

Output: `dist/` folder ready for deployment

### Backend
```bash
cd styleai/server
npm start  # Production mode
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables from `.env`

### Backend (Railway/Heroku/DigitalOcean)
1. Connect GitHub repo
2. Add environment variables
3. Set start command: `npm start`
4. Ensure MongoDB connection string is configured

---

## 🐛 Troubleshooting

### Frontend Issues

**Issue**: "Failed to fetch" error when analyzing
- **Solution**: Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`

**Issue**: Styles not loading
- **Solution**: Clear browser cache
- Verify Tailwind CDN is loading (check Network tab)

### Backend Issues

**Issue**: MongoDB connection failed
- **Solution**: Ensure MongoDB is running
- Test connection: `mongosh`
- Check `MONGODB_URI` in `server/.env`

**Issue**: Groq API errors
- **Solution**: Verify API key is correct
- Check Groq API status
- Backend will use fallback analysis if AI fails

**Issue**: Rate limit errors
- **Solution**: Wait 15 minutes or adjust limits in `middleware/rateLimiter.js`

### General Issues

**Issue**: Port already in use
- **Solution**: Kill process using the port
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend

# Or change port in .env files
```

---

## 📊 Database Schema

### Analysis Collection
```javascript
{
  _id: ObjectId,
  imageData: String,        // Truncated base64
  score: Number,            // 0-100
  status: String,           // ELITE|FIRE|SOLID|MID|NEEDS WORK
  vibe: String,             // One-word aesthetic
  trending: Boolean,
  colors: Array,            // [{hex, name}]
  silhouette: String,
  coordination: String,
  xfactor: String,
  recommendation: String,
  suggestions: Array,       // [{occasion, icon, description}]
  userAgent: String,
  ipAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Notes

- ✅ API key is configured (don't commit to public repos)
- ✅ Rate limiting enabled (10 req/15min)
- ✅ Input validation on all endpoints
- ✅ CORS configured for allowed origins
- ✅ Helmet.js for secure HTTP headers
- ✅ MongoDB injection protection via Mongoose

---

## 📚 Tech Stack Details

### Frontend
- **React 19**: Latest React with modern hooks
- **Vite**: Next-gen build tool
- **Tailwind CSS**: Utility-first CSS (via CDN)
- **React Router v7**: Client-side routing
- **Google Fonts**: Syne, Space Mono, Archivo Narrow
- **Material Icons**: Icon library

### Backend
- **Express.js**: Web framework
- **MongoDB + Mongoose**: Database & ODM
- **Groq SDK**: AI integration
- **Helmet.js**: Security middleware
- **Morgan**: HTTP logging
- **Compression**: Response compression
- **Express Rate Limit**: Rate limiting
- **CORS**: Cross-origin handling

---

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Groq Documentation](https://console.groq.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

---

## 📝 Scripts Reference

### Frontend (`styleai/`)
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend (`styleai/server/`)
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-restart)
```

---

## 💡 Tips & Best Practices

1. **Development**: Run both frontend and backend concurrently
2. **Testing**: Test API endpoints with Postman or cURL
3. **Debugging**: Check browser console and terminal logs
4. **Database**: Regularly backup MongoDB data
5. **Performance**: Monitor API response times
6. **Security**: Never commit API keys to version control

---

## 📞 Support

- **Documentation**: Check README files in `/` and `/server`
- **Issues**: Create GitHub issue with detailed description
- **Logs**: Check browser console and server terminal

---

## ⚡ Performance Optimization

- Frontend: Code splitting, lazy loading, image optimization
- Backend: Database indexing, query optimization, caching
- API: Rate limiting, compression, efficient data transfer

---

## 🎉 You're All Set!

Your STYLEAI platform is ready to analyze outfits with AI power!

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

**Enjoy building with STYLEAI! 🚀**
