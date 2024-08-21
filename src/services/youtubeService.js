import {
  getChannelIdApi,
  getPlaylistItemsApi,
  getVideoStatsApi,
  getDislikesApi,
  getChannelDetailsApi,
  searchVideosApi,
  getVideoDetailsApi,
  getVideoCommentsApi,
} from "../api/youtubeApi";
import {
  extractUsernameFromUrl,
  extractVideoId,
  extractPlaylistId,
} from "../utils/extractors";
import { analyzeSentiment } from "../services/sentimentService";

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
  const processedVideos = [];

  for (const video of videoData) {
    try {
      const dislikesResponse = await getDislikesApi(video.id);
      const dislikesData = dislikesResponse.data;

      const rating = dislikesData.rating;
      const scaledRating = Math.round(Math.min((rating / 5) * 5000));

      processedVideos.push({
        ...video,
        dislikes: dislikesData.dislikes,
        likes: dislikesData.likes,
        views: dislikesData.viewCount,
        rating: scaledRating,
        likeDislikeRatio: (
          (dislikesData.likes / (dislikesData.likes + dislikesData.dislikes)) *
          100
        ).toFixed(2),
        likeViewRatio: (
          (dislikesData.likes / dislikesData.viewCount) *
          100
        ).toFixed(2),
      });
    } catch (error) {
      console.error(`Error processing video ${video.id}:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
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

export const getVideos = async (
  input,
  type,
  onVideoFetched,
  videoLimit = 50
) => {
  let videoIds;

  switch (type) {
    case "search":
      videoIds = await getSearchVideoIds(input, videoLimit);
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
const getSearchVideoIds = async (query, videoLimit) => {
  const searchResponse = await searchVideosApi(query, videoLimit);
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

const getVideoIdsFromLinks = (links) => {
  return links
    .split(",")
    .map((link) => link.trim())
    .map((link) => extractVideoId(link))
    .filter((id) => id !== null)
    .join(",");
};

export const getVideoDetails = async (videoId) => {
  const [statsResponse, detailsResponse, dislikesResponse] = await Promise.all([
    getVideoStatsApi(videoId),
    getVideoDetailsApi(videoId),
    getDislikesApi(videoId),
  ]);

  const stats = statsResponse.data.items[0].statistics;
  const details = detailsResponse.data.items[0].snippet;
  const dislikesData = dislikesResponse.data;

  const scaledRating = dislikesData.rating;

  const videoData = {
    id: videoId,
    title: details.title,
    description: details.description,
    publishedAt: details.publishedAt,
    thumbnail: details.thumbnails.high.url,
    views: dislikesData.viewCount,
    likes: dislikesData.likes,
    dislikes: dislikesData.dislikes,
    comments: parseInt(stats.commentCount) || 0,
    likeDislikeRatio: (
      (dislikesData.likes / (dislikesData.likes + dislikesData.dislikes)) *
      100
    ).toFixed(2),
    likeViewRatio: (
      (dislikesData.likes / dislikesData.viewCount) *
      100
    ).toFixed(2),
    rating: scaledRating,
  };

  return videoData;
};

import { analyzeCommentsWithGemini } from "../api/geminiApi";

export const getVideoComments = async (
  videoId,
  commentCount,
  analysisLanguage
) => {
  try {
    const response = await getVideoCommentsApi(videoId, commentCount);
    const comments = response.data.items.map((item) => ({
      id: item.id,
      text: item.snippet.topLevelComment.snippet.textDisplay,
    }));

    const commentTexts = comments.map((comment) => comment.text);
    const sentimentScores = await analyzeSentiment(commentTexts);

    // Analyze comments with Gemini
    const geminiAnalysis = await analyzeCommentsWithGemini(
      commentTexts,
      analysisLanguage
    );

    return {
      comments: comments.map((comment, index) => ({
        ...comment,
        sentimentScore: sentimentScores[index],
      })),
      geminiAnalysis,
    };
  } catch (error) {
    console.error("Error fetching video comments:", error);
    throw error;
  }
};
