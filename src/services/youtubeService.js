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
      if (i === maxRetries - 1) {
        console.error(`Max retries reached for video ID: ${videoId}`);
        return null; // Return null to indicate failure
      }
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
      const dislikes = await fetchDislikesWithRetry(id, maxRetries);
      if (dislikes === null) {
        failedVideos.push(id); // Track the failed video and skip further processing
        continue;
      }

      const likes = video.likes || 0;
      const views = video.views || 0;

      processedVideos.push({
        ...video,
        dislikes,
        comments: video.comments || 0,
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
      comments: parseInt(stats.commentCount) || 0,
    };
  });

  return processVideoData(videoData);
};

const processAndSetVideos = async (videoIds, onVideoFetched) => {
  const uniqueVideoIds = [...new Set(videoIds)];
  const processedVideos = [];
  const totalVideos = uniqueVideoIds.length;

  console.log(`Processing ${totalVideos} videos...`);

  for (let i = 0; i < totalVideos; i++) {
    const videoId = uniqueVideoIds[i];
    try {
      const videoData = await processVideoIds(videoId);
      processedVideos.push(...videoData);
      const progress = ((i + 1) / totalVideos) * 100;
      console.log(`Progress after fetching video ${i + 1}: ${progress}%`);
      onVideoFetched([...processedVideos], progress);
    } catch (error) {
      console.error(`Error processing video ${videoId}:`, error);
    }
  }
};

export const getVideos = async (input, type, onVideoFetched) => {
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
    case "csv":
      videoIds = getVideoIdsFromCsv(input);
      break;
    default:
      throw new Error("Invalid type");
  }

  const videoIdsArray = videoIds.split(",");
  await processAndSetVideos(videoIdsArray, onVideoFetched);
  console.log(`Total unique video IDs fetched: ${videoIdsArray.length}`);
  return videoIdsArray.length;
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

const getVideoIdsFromCsv = (csvData) => {
  return csvData.map((url) => extractVideoId(url)).join(",");
};

export const getVideoDetails = async (videoId) => {
  const [statsResponse, detailsResponse, dislikesResponse] = await Promise.all([
    getVideoStatsApi(videoId),
    getVideoDetailsApi(videoId),
    getDislikesApi(videoId),
  ]);

  const stats = statsResponse.data.items[0].statistics;
  const details = detailsResponse.data.items[0].snippet;
  const dislikes = dislikesResponse.data.dislikes;

  const likes = parseInt(stats.likeCount) || 0;
  const views = parseInt(stats.viewCount) || 0;
  const comments = parseInt(stats.commentCount) || 0;

  return {
    id: videoId,
    title: details.title,
    description: details.description,
    publishedAt: details.publishedAt,
    thumbnail: details.thumbnails.high.url,
    views,
    likes,
    dislikes,
    comments,
    likeDislikeRatio: likes + dislikes > 0 ? ((likes / (likes + dislikes)) * 100).toFixed(2) : "0",
    likeViewRatio: views > 0 ? ((likes / views) * 100).toFixed(2) : "0",
  };
};