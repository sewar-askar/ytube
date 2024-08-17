import axios from "axios";
import { fetchFromApi } from "../utils/apiHelper";

export const getChannelIdApi = async (channelUsername) => {
  return fetchFromApi("search", {
    part: "snippet",
    q: channelUsername,
    type: "channel",
  });
};

export const getPlaylistItemsApi = async (
  uploadsPlaylistId,
  pageToken = null
) => {
  return fetchFromApi("playlistItems", {
    part: "snippet",
    playlistId: uploadsPlaylistId,
    maxResults: 50,
    pageToken,
  });
};

export const getVideoStatsApi = async (videoIds) => {
  return fetchFromApi("videos", {
    part: "statistics",
    id: videoIds,
  });
};

export const getDislikesApi = async (videoId) => {
  return axios.get("https://returnyoutubedislikeapi.com/votes", {
    params: { videoId },
  });
};

export const getChannelDetailsApi = async (channelId) => {
  return fetchFromApi("channels", {
    part: "contentDetails",
    id: channelId,
  });
};
export const searchVideosApi = async (query, maxResults = 50) => {
  return fetchFromApi("search", {
    part: "snippet",
    q: query,
    type: "video",
    maxResults: maxResults,
  });
};

export const getVideoDetailsApi = async (videoIds) => {
  return fetchFromApi("videos", {
    part: "snippet",
    id: videoIds,
  });
};
export const getVideoCommentsApi = async (videoId, maxResults ) => {
  return fetchFromApi("commentThreads", {
    part: "snippet",
    videoId: videoId,
    maxResults: maxResults,
    order: "relevance",
  });
};