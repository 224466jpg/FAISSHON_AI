import { analyzeOutfitAPI } from './apiService';

// Main function to analyze outfit (uses backend API by default)
export async function analyzeOutfit(imageBase64) {
  try {
    // Try backend API first
    const result = await analyzeOutfitAPI(imageBase64);
    
    if (result.fallback) {
      console.warn('⚠️  Using fallback analysis from backend');
    }
    
    return result.data;

  } catch (error) {
    console.error('Backend API failed, using client-side fallback:', error);
    
    // Fallback to client-side analysis
    return getFallbackAnalysis();
  }
}

// Client-side fallback analysis
function getFallbackAnalysis() {
  const scores = [94, 87, 91, 78, 85];
  const statuses = ['ELITE', 'FIRE', 'SOLID'];
  const vibes = ['IMMACULATE', 'CLEAN', 'SLICK', 'BOLD', 'FRESH'];
  
  const randomScore = scores[Math.floor(Math.random() * scores.length)];
  
  return {
    score: randomScore,
    status: randomScore >= 90 ? 'ELITE' : randomScore >= 75 ? 'FIRE' : 'SOLID',
    vibe: vibes[Math.floor(Math.random() * vibes.length)],
    trending: Math.random() > 0.5,
    colors: [
      { hex: '#EBEBEB', name: 'OFF WHITE' },
      { hex: '#1B1B1B', name: 'ONYX' },
      { hex: '#B5A191', name: 'TAUPE' },
      { hex: '#CCFF00', name: 'ACCENT' }
    ],
    silhouette: `Silhouette: ${Math.floor(randomScore / 10)}/10 - Structured and balanced`,
    coordination: `Coordination: ${Math.floor(randomScore / 10)}/10 - Colors work well`,
    xfactor: `X-Factor: ${Math.floor(randomScore / 10)}/10 - Unique personal style`,
    recommendation: 'ADD SILVER ACCESSORIES FOR EXTRA EDGE',
    suggestions: [
      {
        occasion: 'CHILL',
        icon: '🎧',
        description: 'SWAP BLAZER FOR ZIP-UP HOODIE. KEEP TROUSERS. ADD BEANIE.'
      },
      {
        occasion: 'RAVE',
        icon: '⚡',
        description: 'REPLACE SHIRT WITH MESH BASE LAYER. ADD REFLECTIVE VEST.'
      },
      {
        occasion: 'WORK',
        icon: '💼',
        description: 'CURRENT STATE: OPTIMAL. ADD OVERSIZED TRENCH FOR DEPTH.'
      }
    ]
  };
}
