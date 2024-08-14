import {
  getChannelIdApi,
  getPlaylistItemsApi,
  getVideoStatsApi,
  getDislikesApi,
  getChannelDetailsApi,
} from "../api/youtubeApi";
import { extractUsernameFromUrl } from "../utils/extractUsernameFromUrl";

const DISLIKE_API_LIMIT = 100;
const QUEUE_INTERVAL = 500; // 1 second between each batch request to stay within rate limits
const RETRY_INTERVAL = 1000; // 10 seconds retry interval

let videoQueue = [];
let isQueueProcessing = false;

export const getChannelId = async (channelUrl) => {
  let channelId = null;

  if (channelUrl.includes("youtube.com/channel/")) {
    channelId = channelUrl.split("/channel/")[1];
  } else {
    const channelUsername = extractUsernameFromUrl(channelUrl);
    const searchResponse = await getChannelIdApi(channelUsername);

    if (searchResponse.data.items.length === 0) {
      throw new Error("Channel not found");
    }

    channelId = searchResponse.data.items[0].snippet.channelId;
  }

  return channelId;
};

export const getAllVideos = async (uploadsPlaylistId, setVideos) => {
  let videos = [];
  let nextPageToken = null;

  do {
    const videosResponse = await getPlaylistItemsApi(
      uploadsPlaylistId,
      nextPageToken
    );

    const videoIds = videosResponse.data.items
      .map((item) => item.snippet.resourceId.videoId)
      .join(",");

    const statsResponse = await getVideoStatsApi(videoIds);

    const videoData = videosResponse.data.items.map((item, index) => {
      const views =
        parseInt(statsResponse.data.items[index].statistics.viewCount) || 0;
      const likes =
        parseInt(statsResponse.data.items[index].statistics.likeCount) || 0;

      return {
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        views,
        likes,
        dislikes: 0, // Default to 0 dislikes initially
        likeDislikeRatio: "0", // Default to 0% initially
        likeViewRatio: views > 0 ? ((likes / views) * 100).toFixed(2) : "0",
      };
    });

    videos = [...videos, ...videoData];
    nextPageToken = videosResponse.data.nextPageToken;
  } while (nextPageToken);

  videoQueue = [...videos];
  setVideos(videos);
  processQueue(setVideos);
};

const processQueue = async (setVideos) => {
  if (isQueueProcessing) return;
  isQueueProcessing = true;

  while (videoQueue.length > 0) {
    const batch = videoQueue.splice(0, DISLIKE_API_LIMIT);
    const retryQueue = [];

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
          retryQueue.push(video); // Add video to retry queue
          return {
            ...video,
            dislikes: 0, // Fallback to 0 dislikes on error
            likeDislikeRatio: video.likeDislikeRatio,
          };
        }
      })
    );

    setVideos((prevVideos) =>
      prevVideos.map(
        (video) => updatedVideos.find((v) => v.id === video.id) || video
      )
    );

    // If there are videos that failed to fetch dislikes, retry after 10 seconds
    if (retryQueue.length > 0) {
      console.log(`Retrying ${retryQueue.length} videos in 10 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      videoQueue = [...retryQueue, ...videoQueue]; // Add the retry queue back to the video queue
    } else {
      // Wait for the next batch if no retries are needed
      await new Promise((resolve) => setTimeout(resolve, QUEUE_INTERVAL));
    }
  }

  isQueueProcessing = false;
};

export const getChannelVideos = async (channelUrl, setVideos) => {
  const channelId = await getChannelId(channelUrl);
  const channelResponse = await getChannelDetailsApi(channelId);
  const uploadsPlaylistId =
    channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

  await getAllVideos(uploadsPlaylistId, setVideos);
};
