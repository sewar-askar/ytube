import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const fetchFromApi = (endpoint, params) => {
  return axios.get(`${BASE_URL}/${endpoint}`, {
    params: {
      ...params,
      key: API_KEY,
    },
  });
};
