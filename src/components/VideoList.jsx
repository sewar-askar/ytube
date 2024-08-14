import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChannelVideos } from "../services/youtubeService";

const VideoList = () => {
  const [channelUrl, setChannelUrl] = useState("");
  const [submitChannelUrl, setSubmitChannelUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [sortBy, setSortBy] = useState("publishedAt");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["videos", submitChannelUrl],
    queryFn: () => getChannelVideos(submitChannelUrl, setVideos),
    enabled: !!submitChannelUrl,
    onSuccess: (data) => {
      // Set videos to the data fetched
      setVideos(data);
    },
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitChannelUrl(channelUrl);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Channel Videos</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={channelUrl}
          onChange={(e) => setChannelUrl(e.target.value)}
          placeholder="Enter YouTube Channel URL"
          className="border p-2 mr-2 w-64"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Fetch Videos
        </button>
      </form>
      {console.log(videos)}
      {videos && videos.length > 0 && (
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
              <div key={video.id} className="border p-4 rounded shadow">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full"
                />
                <h2 className="font-bold mt-2">{video.title}</h2>
                <p className="text-sm text-gray-600">
                  Published: {new Date(video.publishedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Views: {(video.views || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Likes: {(video.likes || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Dislikes: {(video.dislikes || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Like/Dislike Ratio: {video.likeDislikeRatio}%
                </p>
                <p className="text-sm text-gray-600">
                  Like/Views Ratio: {video.likeViewRatio}%
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Watch Video
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoList;
