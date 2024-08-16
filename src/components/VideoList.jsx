import React, { useContext, useMemo } from "react";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import VideoItem from "./VideoItem";

const VideoList = () => {
  const { videos, sortBy, setSortBy } = useContext(VideoAnalyticsContext);

  const sortedVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return [...videos].sort((a, b) => {
      switch (sortBy) {
        case "views":
          return (b.views || 0) - (a.views || 0);
        case "likes":
          return (b.likes || 0) - (a.likes || 0);
        case "dislikes":
          return (b.dislikes || 0) - (a.dislikes || 0);
        case "likeDislikeRatio":
          return (
            parseFloat(b.likeDislikeRatio) - parseFloat(a.likeDislikeRatio)
          );
        case "ratio":
          return parseFloat(b.likeViewRatio) - parseFloat(a.likeViewRatio);
        default:
          return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });
  }, [videos, sortBy]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 m-5">
      <div className="flex items-center justify-start w-full">
        <label
          htmlFor="sortBy"
          className="mr-2 text-gray-900 dark:text-gray-300"
        >
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300 dark:bg-gray-800 dark:text-white dark:focus:ring-gray-600"
        >
          <option value="publishedAt">Date (newest first)</option>
          <option value="views">Views</option>
          <option value="likes">Likes</option>
          <option value="dislikes">Dislikes</option>
          <option value="likeDislikeRatio">Like/Dislike Ratio</option>
          <option value="ratio">Like/Views Ratio</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVideos.map((video) => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoList;
