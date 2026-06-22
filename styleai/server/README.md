# STYLEAI Backend API

Express.js backend server for STYLEAI fashion analysis platform with MongoDB storage and Groq AI integration.

## Features

- 🤖 **AI Analysis**: Integration with Groq's LLaMA 3.3 70B model
- 💾 **MongoDB Storage**: Store analysis history and user data
- 🔒 **Rate Limiting**: Protect against abuse (10 requests per 15 minutes)
- 🚀 **RESTful API**: Clean, documented endpoints
- 📊 **Statistics**: Platform-wide analytics and insights
- 🛡️ **Security**: Helmet.js, CORS, input validation
- ⚡ **Performance**: Compression, optimized queries

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- Groq API Key

## Installation

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/styleai
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```
Check if API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "STYLEAI API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

### Analyze Outfit
```
POST /api/analysis/upload
```
Upload and analyze an outfit image.

**Request Body:**
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Outfit analyzed successfully",
  "fallback": false,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "score": 94,
    "status": "ELITE",
    "vibe": "IMMACULATE",
    "trending": true,
    "colors": [
      { "hex": "#EBEBEB", "name": "OFF WHITE" },
      { "hex": "#1B1B1B", "name": "ONYX" }
    ],
    "silhouette": "Silhouette: 10/10 - Structured Perfection",
    "coordination": "Coordination: 9/10 - Peak Minimalist",
    "xfactor": "X-Factor: 12/10 - Quiet Luxury Era",
    "recommendation": "ADD SILVER ACCESSORIES",
    "suggestions": [...]
  }
}
```

**Rate Limit:** 10 requests per 15 minutes per IP

---

### Get Analysis History
```
GET /api/analysis/history?limit=20&skip=0&sortBy=createdAt&order=desc
```
Retrieve past analyses.

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `skip` (optional): Skip N results (default: 0)
- `sortBy` (optional): Sort field (default: createdAt)
- `order` (optional): asc/desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "skip": 0,
    "hasMore": true
  }
}
```

---

### Get Analysis by ID
```
GET /api/analysis/:id
```
Retrieve specific analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "score": 94,
    "status": "ELITE",
    ...
  }
}
```

---

### Get Platform Statistics
```
GET /api/stats
```
Retrieve platform-wide statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAnalyses": 1523,
    "averageScore": 82,
    "statusDistribution": [
      { "_id": "ELITE", "count": 342 },
      { "_id": "FIRE", "count": 567 }
    ],
    "topVibes": [...],
    "recentAnalyses": [...],
    "topScores": [...],
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

## Database Schema

### Analysis Model
```javascript
{
  imageData: String,      // Base64 (truncated)
  score: Number,          // 0-100
  status: String,         // ELITE|FIRE|SOLID|MID|NEEDS WORK
  vibe: String,           // One-word aesthetic
  trending: Boolean,
  colors: [{
    hex: String,
    name: String
  }],
  silhouette: String,
  coordination: String,
  xfactor: String,
  recommendation: String,
  suggestions: [{
    occasion: String,
    icon: String,
    description: String
  }],
  userAgent: String,
  ipAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
server/
├── config/
│   └── database.js           # MongoDB connection
├── controllers/
│   ├── analysisController.js # Analysis endpoints logic
│   └── statsController.js    # Statistics endpoints
├── middleware/
│   ├── errorHandler.js       # Global error handler
│   └── rateLimiter.js        # Rate limiting
├── models/
│   └── Analysis.js           # Mongoose schema
├── routes/
│   ├── analysis.js           # Analysis routes
│   └── stats.js              # Stats routes
├── services/
│   └── groqService.js        # Groq AI integration
├── .env                      # Environment variables
├── server.js                 # Main server file
├── package.json
└── README.md
```

## Error Handling

All errors return JSON in this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", ...]
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## Security Features

1. **Helmet.js**: Sets secure HTTP headers
2. **CORS**: Configurable cross-origin resource sharing
3. **Rate Limiting**: Prevents API abuse
4. **Input Validation**: Validates all incoming data
5. **MongoDB Injection Protection**: Via Mongoose
6. **Data Sanitization**: Removes sensitive fields from responses

## MongoDB Setup

### Local MongoDB:
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify connection
mongosh
```

### Cloud MongoDB (MongoDB Atlas):
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/styleai |
| GROQ_API_KEY | Groq API key | - |
| GROQ_MODEL | AI model name | llama-3.3-70b-versatile |
| NODE_ENV | Environment | development |
| CORS_ORIGIN | Allowed origins | http://localhost:5173 |

## Testing the API

### Using cURL:
```bash
# Health check
curl http://localhost:5000/api/health

# Analyze outfit
curl -X POST http://localhost:5000/api/analysis/upload \
  -H "Content-Type: application/json" \
  -d '{"imageData": "data:image/jpeg;base64,..."}'

# Get history
curl http://localhost:5000/api/analysis/history

# Get stats
curl http://localhost:5000/api/stats
```

### Using Postman:
Import the endpoints and test interactively.

## Deployment

### Heroku:
```bash
heroku create styleai-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set GROQ_API_KEY=your_groq_key
git push heroku main
```

### Railway:
1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically

### DigitalOcean/AWS/Azure:
Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name styleai-api
pm2 save
pm2 startup
```

## Performance Tips

1. **Indexing**: Already configured on commonly queried fields
2. **Lean Queries**: Using `.lean()` for read-only operations
3. **Compression**: Enabled for all responses
4. **Connection Pooling**: Automatic via Mongoose
5. **Caching**: Consider Redis for frequently accessed data

## Troubleshooting

### MongoDB Connection Failed
- Verify MongoDB is running: `mongosh`
- Check connection string in `.env`
- Ensure network access (if using Atlas)

### Rate Limit Issues
- Adjust limits in `middleware/rateLimiter.js`
- Consider per-user limits vs IP limits

### AI Analysis Slow
- Check Groq API status
- Reduce `max_tokens` in groqService.js
- Implement request queuing

### Memory Issues
- Limit base64 image size
- Implement image compression
- Clear old analyses periodically

## License

MIT

---

**Built with ❤️ for STYLEAI**
