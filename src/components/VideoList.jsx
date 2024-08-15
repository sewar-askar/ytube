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
    <>
      <div className="mb-4">
        <label htmlFor="sortBy" className="mr-2">
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2"
        >
          <option value="publishedAt">Date (newest first)</option>
          <option value="views">Views</option>
          <option value="likes">Likes</option>
          <option value="dislikes">Dislikes</option>
          <option value="likeDislikeRatio">Like/Dislike Ratio</option>
          <option value="ratio">Like/Views Ratio</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedVideos.map((video) => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </>
  );
};

export default VideoList;
