import {
  getChannelIdApi,
  getPlaylistItemsApi,
  getVideoStatsApi,
  getDislikesApi,
  getChannelDetailsApi,
  searchVideosApi,
  getVideoDetailsApi,
} from "../api/youtubeApi";
import {
  extractUsernameFromUrl,
  extractVideoId,
  extractPlaylistId,
} from "../utils/extractors";

export const getChannelId = async (channelUrl) => {
  if (channelUrl.includes("youtube.com/channel/")) {
    return channelUrl.split("/channel/")[1];
  }

  const channelUsername = extractUsernameFromUrl(channelUrl);
  const searchResponse = await getChannelIdApi(channelUsername);

  if (searchResponse.data.items.length === 0) {
    throw new Error("Channel not found");
  }

  return searchResponse.data.items[0].snippet.channelId;
};

const fetchAllPlaylistVideos = async (playlistId) => {
  let videos = [];
  let nextPageToken = null;

  do {
    const { data } = await getPlaylistItemsApi(playlistId, nextPageToken);
    nextPageToken = data.nextPageToken;
    videos = [...videos, ...data.items];
  } while (nextPageToken);

  return videos;
};

const fetchDislikesWithRetry = async (
  videoId,
  maxRetries = 3,
  delay = 1000
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const dislikesResponse = await getDislikesApi(videoId);
      return dislikesResponse.data.dislikes;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const processVideoData = async (videoData) => {
  const queue = videoData.map((video) => ({
    id: video.id,
    retries: 0,
    maxRetries: 5,
    video,
  }));

  const processedVideos = [];
  const failedVideos = [];

  while (queue.length > 0) {
    const { id, retries, maxRetries, video } = queue.shift();

    try {
      const dislikes = await fetchDislikesWithRetry(id);
      const likes = video.likes || 0;
      const views = video.views || 0;

      processedVideos.push({
        ...video,
        dislikes,
        likeDislikeRatio:
          likes + dislikes > 0
            ? ((likes / (likes + dislikes)) * 100).toFixed(2)
            : "0",
        likeViewRatio: views > 0 ? ((likes / views) * 100).toFixed(2) : "0",
      });
    } catch (error) {
      if (retries < maxRetries) {
        queue.push({ id, retries: retries + 1, maxRetries, video });
      } else {
        failedVideos.push(id);
      }
    }

    // delay
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  if (failedVideos.length > 0) {
    console.error(
      `Failed to fetch dislikes for videos: ${failedVideos.join(", ")}`
    );
  }

  return processedVideos;
};

const processVideoIds = async (videoIds) => {
  const statsResponse = await getVideoStatsApi(videoIds);
  const videoDetails = await getVideoDetailsApi(videoIds);

  const videoData = statsResponse.data.items.map((item, index) => {
    const details = videoDetails.data.items[index];
    const stats = item.statistics;
    return {
      id: item.id,
      title: details.snippet.title,
      thumbnail: details.snippet.thumbnails.medium.url,
      publishedAt: details.snippet.publishedAt,
      views: parseInt(stats.viewCount) || 0,
      likes: parseInt(stats.likeCount) || 0,
    };
  });

  return processVideoData(videoData);
};

const processAndSetVideos = async (videoIds, setVideos) => {
  const processedVideos = await processVideoIds(videoIds);
  setVideos(processedVideos); // Ensures the UI is updated after processing is complete
};

export const getVideos = async (input, type, setVideos) => {
  let videoIds;

  switch (type) {
    case "search":
      videoIds = await getSearchVideoIds(input);
      break;
    case "channel":
      videoIds = await getChannelVideoIds(input);
      break;
    case "playlist":
      videoIds = await getPlaylistVideoIds(input);
      break;
    case "video":
      videoIds = extractVideoId(input);
      break;
    case "json":
      videoIds = getVideoIdsFromJson(input);
      break;
    default:
      throw new Error("Invalid type");
  }

  await processAndSetVideos(videoIds, setVideos);
};

// Implement these helper functions to get video IDs for each type
const getSearchVideoIds = async (query) => {
  const searchResponse = await searchVideosApi(query);
  return searchResponse.data.items.map((item) => item.id.videoId).join(",");
};

const getChannelVideoIds = async (channelUrl) => {
  const channelId = await getChannelId(channelUrl);
  const channelResponse = await getChannelDetailsApi(channelId);
  const uploadsPlaylistId =
    channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
  const videos = await fetchAllPlaylistVideos(uploadsPlaylistId);
  return videos.map((item) => item.snippet.resourceId.videoId).join(",");
};

const getPlaylistVideoIds = async (playlistUrl) => {
  const playlistId = extractPlaylistId(playlistUrl);
  const videos = await fetchAllPlaylistVideos(playlistId);
  return videos.map((item) => item.snippet.resourceId.videoId).join(",");
};

const getVideoIdsFromJson = (jsonData) => {
  return jsonData.map((item) => extractVideoId(item.url)).join(",");
};
