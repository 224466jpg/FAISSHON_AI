/**
 * API Service - Central API integration for STYLEAI
 * Handles all backend communication with proper error handling
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const headers = { ...options.headers };

  // If the body is FormData (used for multer file uploads), let the browser set the boundary headers
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ==================== OUTFIT ANALYSIS ====================

/**
 * Analyze outfit with AI
 * @param {string} imageData - Base64 encoded image
 * @returns {Promise} Analysis result
 */
export async function analyzeOutfit(data) {
  const isFormData = data instanceof FormData;
  return apiRequest('/analyze-outfit', {
    method: 'POST',
    body: isFormData ? data : JSON.stringify({ imageData: data }),
  });
}

/**
 * Get analysis history
 * @param {Object} params - Query parameters
 * @returns {Promise} List of past analyses
 */
export async function getAnalysisHistory(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/analysis/history?${queryString}`);
}

/**
 * Get specific analysis by ID
 * @param {string} id - Analysis ID
 * @returns {Promise} Analysis details
 */
export async function getAnalysisById(id) {
  return apiRequest(`/analysis/${id}`);
}

// ==================== RECOMMENDATIONS ====================

/**
 * Get all fashion recommendations
 * @param {Object} params - Query parameters
 * @returns {Promise} List of recommendations
 */
export async function getRecommendations(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/recommendations?${queryString}`);
}

/**
 * Get trending fashion recommendations
 * @param {number} limit - Number of results
 * @returns {Promise} Trending recommendations
 */
export async function getTrending(limit = 10) {
  return apiRequest(`/trending?limit=${limit}`);
}

/**
 * Save/bookmark a recommendation
 * @param {string} recommendationId - Recommendation ID
 * @returns {Promise} Updated recommendation
 */
export async function saveRecommendation(recommendationId) {
  return apiRequest('/save-recommendation', {
    method: 'POST',
    body: JSON.stringify({ recommendationId }),
  });
}

// ==================== STATS ====================

/**
 * Get platform statistics
 * @returns {Promise} Platform stats
 */
export async function getPlatformStats() {
  return apiRequest('/stats');
}

// ==================== HEALTH CHECK ====================

/**
 * Check API health
 * @returns {Promise} Health status
 */
export async function checkAPIHealth() {
  try {
    return await apiRequest('/health');
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return { status: 'ERROR', message: error.message };
  }
}

// Export all API functions
export default {
  analyzeOutfit,
  getAnalysisHistory,
  getAnalysisById,
  getRecommendations,
  getTrending,
  saveRecommendation,
  getPlatformStats,
  checkAPIHealth,
};
