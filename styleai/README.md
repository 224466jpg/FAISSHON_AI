# STYLEAI - AI-Powered Fashion Analysis Platform

A cutting-edge neo-brutalist fashion website that uses AI to analyze outfits and provide personalized style recommendations.

## Features

✨ **AI Outfit Analysis** - Upload your outfit photo and get instant AI-powered fashion feedback
🎨 **Color Palette Detection** - Automatically identifies dominant colors in your outfit
📊 **Style Scoring** - Get rated on silhouette, coordination, and X-factor
💡 **Smart Suggestions** - Receive outfit modifications for different occasions (Chill, Rave, Work)
🎯 **Neo-Brutalist Design** - Bold, high-contrast UI with sharp edges and dramatic shadows

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **AI**: Groq API with LLaMA 3.3 70B
- **Design**: Neo-Brutalist aesthetic with custom animations

## Prerequisites

- Node.js 18+ and npm
- Groq API key (already configured in `.env`)

## Installation

1. Navigate to the project directory:
```bash
cd styleai
```

2. Install dependencies:
```bash
npm install
```

3. The API key is already configured in `.env`:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GROQ_MODEL=llama-3.3-70b-versatile
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

## Usage

### Home Page
- Browse featured style collections
- Explore different aesthetic vibes (Weekend, Rave, Street)
- Click "TRY FIT CHECK AI" to analyze your outfit

### Fit Check Page
1. **Upload Image**: Drag & drop or click to select your outfit photo
2. **Analyze**: Click "⚡ ANALYZE FIT" button
3. **View Results**:
   - Overall score out of 100
   - Status badge (ELITE, FIRE, SOLID, MID, NEEDS WORK)
   - Color palette extraction
   - AI verdict with detailed breakdown
   - Recommendations for improvement
   - Outfit suggestions for different occasions

## Project Structure

```
styleai/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar component
│   │   └── Footer.jsx          # Footer component
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page with style showcase
│   │   └── FitCheckPage.jsx    # AI outfit analysis page
│   ├── services/
│   │   └── groqService.js      # Groq API integration
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # Global styles and animations
│   ├── index.css               # Base CSS imports
│   └── main.jsx                # React entry point
├── public/                     # Static assets
├── .env                        # Environment variables (API key)
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

## Key Features Explained

### AI Analysis
- Uses Groq's LLaMA 3.3 70B model for intelligent outfit analysis
- Provides structured JSON responses with scores, colors, and suggestions
- Falls back to demo data if API is unavailable

### Image Upload
- Supports drag & drop functionality
- Accepts JPG, PNG, and WEBP formats
- Real-time preview before analysis
- Base64 encoding for API transmission

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons and interactions
- Adaptive layouts for all screen sizes

## Color Palette

The design uses a bold neo-brutalist color scheme:
- **Primary**: `#506600` (Olive green)
- **Primary Container**: `#CCFF00` (Neon lime)
- **Secondary**: `#9500CB` (Vivid purple)
- **Tertiary**: `#BB0058` (Hot magenta)
- **Background**: `#F9F9F9` (Off white)
- **On Background**: `#1B1B1B` (Near black)

## Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Troubleshooting

### API Issues
- Verify your Groq API key is valid in `.env`
- Check browser console for error messages
- The app includes fallback demo data if API fails

### Image Upload Issues
- Ensure file is a valid image format (JPG, PNG, WEBP)
- Check file size (recommended under 5MB)
- Verify browser supports FileReader API

### Styling Issues
- Clear browser cache
- Ensure Tailwind CDN is loading (check network tab)
- Verify Google Fonts are loading properly

## Future Enhancements

- [ ] Save analysis history to local storage
- [ ] Share results on social media
- [ ] Compare multiple outfits side-by-side
- [ ] User accounts and profile system
- [ ] Wardrobe management features
- [ ] Shopping recommendations with affiliate links
- [ ] Integration with fashion e-commerce APIs

## License

MIT License - Feel free to use for personal or commercial projects

## Credits

- **Design Inspiration**: Neo-brutalism web design trend
- **AI Model**: Groq + Meta's LLaMA 3.3 70B
- **Icons**: Google Material Symbols
- **Fonts**: Syne, Space Mono, Archivo Narrow

---

**DESIGNED FOR THE FASTEST** 🚀

For issues or questions, check the browser console for detailed error messages.
