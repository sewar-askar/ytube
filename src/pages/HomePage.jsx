import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";

const HomePage = () => {
  const { clearVideos } = useContext(VideoAnalyticsContext);

  useEffect(() => {
    clearVideos();
  }, [clearVideos]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Video Analyzer</h1>
      <p className="mb-4">Select a source to analyze YouTube videos:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/analytics?type=search"
          className="bg-blue-500 text-white p-4 rounded text-center"
        >
          Search Query
        </Link>
        <Link
          to="/analytics?type=channel"
          className="bg-blue-500 text-white p-4 rounded text-center"
        >
          YouTube Channel
        </Link>
        <Link
          to="/analytics?type=playlist"
          className="bg-blue-500 text-white p-4 rounded text-center"
        >
          YouTube Playlist
        </Link>
        <Link
          to="/analytics?type=video"
          className="bg-blue-500 text-white p-4 rounded text-center"
        >
          Single Video
        </Link>
        <Link
          to="/analytics?type=json"
          className="bg-blue-500 text-white p-4 rounded text-center"
        >
          JSON File
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
