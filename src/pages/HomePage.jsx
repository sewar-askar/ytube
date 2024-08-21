import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import {
  Search,
  Youtube,
  PlaySquare,
  Film,
  FileJson,
  FileText,
  LinkIcon,
} from "lucide-react";

const HomePage = () => {
  const { clearVideos } = useContext(VideoAnalyticsContext);

  useEffect(() => {
    clearVideos();
  }, [clearVideos]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">
          <span className="text-6xl text-red-500">YouTube</span> Video Analyzer
        </h1>
        <p className="text-xl text-gray-900 mt-4 max-w-2xl mx-auto">
          Analyze YouTube videos effortlessly using various sources such as
          Search Queries, Channels, Playlists, or even a single video.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <AnalyzerButton
          to="/analytics?type=search"
          icon={Search}
          label="Search Query"
        />
        <AnalyzerButton
          to="/analytics?type=channel"
          icon={Youtube}
          label="YouTube Channel"
        />
        <AnalyzerButton
          to="/analytics?type=playlist"
          icon={PlaySquare}
          label="YouTube Playlist"
        />
        <AnalyzerButton
          to="/analytics?type=video"
          icon={Film}
          label="Single Video"
        />
        <AnalyzerButton
          to="/analytics?type=json"
          icon={FileJson}
          label="JSON File"
        />
        <AnalyzerButton
          to="/analytics?type=csv"
          icon={FileText}
          label="CSV File"
        />
        <AnalyzerButton
          to="/analytics?type=links"
          icon={LinkIcon}
          label="Links as Text"
        />
      </div>
    </div>
  );
};

const AnalyzerButton = ({ to, icon: Icon, label }) => (
  <Link to={to} className="block">
    <div className="group transform transition duration-300 hover:scale-105 hover:shadow-lg rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-red-500 hover:border-red-500 hover:text-white">
      <div className="p-8 flex items-center space-x-4 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white">
        <Icon className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors duration-300" />
        <div className="text-xl font-medium group-hover:text-white transition-colors duration-300">
          {label}
        </div>
      </div>
      <div className="p-4 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white">
        <div className="text-gray-600 group-hover:text-white transition-colors duration-300">
          Analyze YouTube content using {label}.
        </div>
      </div>
    </div>
  </Link>
);

export default HomePage;