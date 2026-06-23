const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error('Unable to reach the server. Make sure the backend is running and try again.');
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Something went wrong. Please try again.');
  }

  return result.data ?? result;
}

export async function uploadAndAnalyzeOutfit(file) {
  const formData = new FormData();
  formData.append('outfitImage', file);

  return request('/analysis/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getRecommendations() {
  return request('/recommendations');
}

export async function getOutfits() {
  return request('/outfits');
}

export async function saveOutfit(file, fields = {}) {
  const formData = new FormData();
  formData.append('outfitImage', file);
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return request('/outfits', {
    method: 'POST',
    body: formData,
  });
}

export async function loginUser(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(credentials) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function getStats() {
  return request('/stats');
}

export async function sendContactMessage(message) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(message),
  });
}

export async function placeOrder(order) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}
