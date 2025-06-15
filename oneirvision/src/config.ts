// Configuration for API endpoints and keys

// For direct frontend API calls (current implementation)
export const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
export const HUGGINGFACE_API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;

// Backend API configuration (for future backend integration)
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

// API endpoints
export const API_ENDPOINTS = {
  GEMINI_GENERATE: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  HUGGINGFACE_IMAGE: 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
  // Backend endpoints (for future use)
  BACKEND_INTERPRET: `${API_BASE_URL}/api/interpret`,
  BACKEND_VISUALIZE: `${API_BASE_URL}/api/visualize`,
  BACKEND_SEQUENTIAL: `${API_BASE_URL}/api/visualize-sequential`,
};