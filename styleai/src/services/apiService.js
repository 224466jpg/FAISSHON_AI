const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Health check
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return { status: 'ERROR', message: error.message };
  }
}

// Analyze outfit via backend API
export async function analyzeOutfitAPI(imageData) {
  try {
    const response = await fetch(`${API_URL}/analysis/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Analysis failed');
    }

    return {
      success: true,
      data: data.data,
      fallback: data.fallback
    };

  } catch (error) {
    console.error('API Analysis Error:', error);
    throw error;
  }
}

// Get analysis history
export async function getAnalysisHistory(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/analysis/history?${queryString}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch history');
    }

    return data;

  } catch (error) {
    console.error('Get History Error:', error);
    return {
      success: true,
      data: [],
      pagination: { total: 0, limit: 20, skip: 0, hasMore: false }
    };
  }
}

// Get specific analysis by ID
export async function getAnalysisById(id) {
  try {
    const response = await fetch(`${API_URL}/analysis/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Analysis not found');
    }

    return data;

  } catch (error) {
    console.error('Get Analysis Error:', error);
    throw error;
  }
}

// Get platform stats
export async function getPlatformStats() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stats');
    }

    return data;

  } catch (error) {
    console.error('Get Stats Error:', error);
    return {
      success: true,
      data: {
        totalAnalyses: 0,
        averageScore: 0,
        statusDistribution: [],
        topVibes: []
      }
    };
  }
}
