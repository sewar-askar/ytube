import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const getChannelIdApi = async (channelUsername) => {
  return axios.get(`${BASE_URL}/search`, {
    params: {
      part: "snippet",
      q: channelUsername,
      type: "channel",
      key: API_KEY,
    },
  });
};

export const getPlaylistItemsApi = async (
  uploadsPlaylistId,
  pageToken = null
) => {
  return axios.get(`${BASE_URL}/playlistItems`, {
    params: {
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken: pageToken,
      key: API_KEY,
    },
  });
};

export const getVideoStatsApi = async (videoIds) => {
  return axios.get(`${BASE_URL}/videos`, {
    params: {
      part: "statistics",
      id: videoIds,
      key: API_KEY,
    },
  });
};

export const getDislikesApi = async (videoId) => {
  return axios.get(`https://returnyoutubedislikeapi.com/votes`, {
    params: { videoId },
  });
};

export const getChannelDetailsApi = async (channelId) => {
  return axios.get(`${BASE_URL}/channels`, {
    params: {
      part: "contentDetails",
      id: channelId,
      key: API_KEY,
    },
  });
};
