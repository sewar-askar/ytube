import axios from 'axios';

const API_KEY = import.meta.env.VITE_PERSPECTIVE_API_KEY;
const API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

export const analyzeSentimentApi = async (text) => {
  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      comment: { text },
      languages: ['en'],
      requestedAttributes: { TOXICITY: {} }
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Perspective API:', error);
    throw error;
  }
};