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

const DISLIKE_API_LIMIT = 100;
const QUEUE_INTERVAL = 500;

let videoQueue = [];
let isQueueProcessing = false;

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

const fetchAllPlaylistVideos = async (uploadsPlaylistId) => {
  let videos = [];
  let nextPageToken = null;

  do {
    const { data } = await getPlaylistItemsApi(
      uploadsPlaylistId,
      nextPageToken
    );
    nextPageToken = data.nextPageToken;
    videos = [...videos, ...data.items];
  } while (nextPageToken);

  return videos;
};

const fetchDislikesForBatch = async (batch) => {
  const updatedVideos = await Promise.all(
    batch.map(async (video) => {
      try {
        const dislikesResponse = await getDislikesApi(video.id);
        const dislikes = dislikesResponse.data.dislikes;
        return {
          ...video,
          dislikes,
          likeDislikeRatio:
            video.likes + dislikes > 0
              ? ((video.likes / (video.likes + dislikes)) * 100).toFixed(2)
              : "0",
        };
      } catch (error) {
        console.error(
          `Error fetching dislikes for video ${video.id}:`,
          error.message
        );
        return {
          ...video,
          dislikes: 0,
          likeDislikeRatio: video.likeDislikeRatio,
        };
      }
    })
  );
  return updatedVideos;
};

const processQueue = async (setVideos) => {
  if (isQueueProcessing) return;
  isQueueProcessing = true;

  while (videoQueue.length > 0) {
    const batch = videoQueue.splice(0, DISLIKE_API_LIMIT);
    const updatedVideos = await fetchDislikesForBatch(batch);

    setVideos((prevVideos) =>
      prevVideos.map(
        (video) => updatedVideos.find((v) => v.id === video.id) || video
      )
    );

    await new Promise((resolve) => setTimeout(resolve, QUEUE_INTERVAL));
  }

  isQueueProcessing = false;
};

export const getAllVideos = async (uploadsPlaylistId, setVideos) => {
  const videos = await fetchAllPlaylistVideos(uploadsPlaylistId);
  const videoIds = videos
    .map((item) => item.snippet.resourceId.videoId)
    .join(",");

  // Fetch stats after videos have been fetched
  const statsResponse = await getVideoStatsApi(videoIds);

  const videoData = videos.map((item, index) => {
    const stats = statsResponse.data.items[index].statistics; // Corrected stats reference
    const views = parseInt(stats.viewCount) || 0;
    const likes = parseInt(stats.likeCount) || 0;

    return {
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      views,
      likes,
      dislikes: 0,
      likeDislikeRatio: "0",
      likeViewRatio: views > 0 ? ((likes / views) * 100).toFixed(2) : "0",
    };
  });

  setVideos(videoData);
  videoQueue = [...videoData];
  processQueue(setVideos);
};

export const getChannelVideos = async (channelUrl, setVideos) => {
  const channelId = await getChannelId(channelUrl);
  const channelResponse = await getChannelDetailsApi(channelId);
  const uploadsPlaylistId =
    channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

  await getAllVideos(uploadsPlaylistId, setVideos);
};
export const getVideos = async (input, type, setVideos) => {
  switch (type) {
    case "search":
      return await getSearchVideos(input, setVideos);
    case "channel":
      return await getChannelVideos(input, setVideos);
    case "playlist":
      return await getPlaylistVideos(input, setVideos);
    case "video":
      return await getSingleVideo(input, setVideos);
    case "json":
      return await getVideosFromJson(input, setVideos);
    default:
      throw new Error("Invalid type");
  }
};

const getSearchVideos = async (query, setVideos) => {
  const searchResponse = await searchVideosApi(query);
  const videoIds = searchResponse.data.items
    .map((item) => item.id.videoId)
    .join(",");
  const videoData = await processVideoIds(videoIds);
  setVideos(videoData);
};

const getPlaylistVideos = async (playlistUrl, setVideos) => {
  const playlistId = extractPlaylistId(playlistUrl);
  const videos = await fetchAllPlaylistVideos(playlistId);
  const videoIds = videos
    .map((item) => item.snippet.resourceId.videoId)
    .join(",");
  const videoData = await processVideoIds(videoIds);
  setVideos(videoData);
};

const getSingleVideo = async (videoUrl, setVideos) => {
  const videoId = extractVideoId(videoUrl);
  const videoData = await processVideoIds(videoId);
  setVideos(videoData);
};

const getVideosFromJson = async (jsonData, setVideos) => {
  const videoIds = jsonData.map((item) => extractVideoId(item.url)).join(",");
  const videoData = await processVideoIds(videoIds);
  setVideos(videoData);
};

const processVideoIds = async (videoIds) => {
  const statsResponse = await getVideoStatsApi(videoIds);
  const videoDetails = await getVideoDetailsApi(videoIds);

  const processedVideos = await Promise.all(
    statsResponse.data.items.map(async (item, index) => {
      const details = videoDetails.data.items[index];
      const stats = item.statistics;
      const views = parseInt(stats.viewCount) || 0;
      const likes = parseInt(stats.likeCount) || 0;

      let dislikes = 0;
      try {
        const dislikesResponse = await getDislikesApi(item.id);
        dislikes = dislikesResponse.data.dislikes;
      } catch (error) {
        console.error(
          `Error fetching dislikes for video ${item.id}:`,
          error.message
        );
      }

      const likeDislikeRatio =
        likes + dislikes > 0
          ? ((likes / (likes + dislikes)) * 100).toFixed(2)
          : "0";

      return {
        id: item.id,
        title: details.snippet.title,
        thumbnail: details.snippet.thumbnails.medium.url,
        publishedAt: details.snippet.publishedAt,
        views,
        likes,
        dislikes,
        likeDislikeRatio,
        likeViewRatio: views > 0 ? ((likes / views) * 100).toFixed(2) : "0",
      };
    })
  );

  return processedVideos;
};
