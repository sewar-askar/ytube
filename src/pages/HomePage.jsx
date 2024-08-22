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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">
          <span className="text-6xl text-red-500">YouTube</span> Video Analyzer
        </h1>
        <p className="text-xl text-gray-700 mt-4 max-w-2xl mx-auto">
          Analyze YouTube videos effortlessly using various sources such as
          Search Queries, Channels, Playlists, or even a single video.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <AnalyzerButton
          to="/analytics?type=search"
          icon={Search}
          label="Search Query"
          color="bg-blue-500"
        />
        <AnalyzerButton
          to="/analytics?type=channel"
          icon={Youtube}
          label="YouTube Channel"
          color="bg-red-500"
        />
        <AnalyzerButton
          to="/analytics?type=playlist"
          icon={PlaySquare}
          label="YouTube Playlist"
          color="bg-green-500"
        />
        <AnalyzerButton
          to="/analytics?type=video"
          icon={Film}
          label="Single Video"
          color="bg-yellow-500"
        />
        <AnalyzerButton
          to="/analytics?type=json"
          icon={FileJson}
          label="JSON File"
          color="bg-purple-500"
        />
        <AnalyzerButton
          to="/analytics?type=csv"
          icon={FileText}
          label="CSV File"
          color="bg-pink-500"
        />
        <AnalyzerButton
          to="/analytics?type=links"
          icon={LinkIcon}
          label="Links as Text"
          color="bg-indigo-500"
        />
      </div>
    </div>
  );
};

const AnalyzerButton = ({ to, icon: Icon, label, color }) => (
  <Link
    to={to}
    className="block transform transition duration-300 hover:scale-105 hover:-rotate-3 hover:z-10"
  >
    <div className={`${color} text-white rounded-lg shadow-lg overflow-hidden`}>
      <div className="p-6 flex flex-col items-center">
        <Icon className="w-12 h-12 mb-4" />
        <div className="text-lg font-semibold text-center">{label}</div>
      </div>
      <div className="bg-white bg-opacity-20 p-4">
        <div className="text-sm text-center">
          Analyze YouTube content using {label}
        </div>
      </div>
    </div>
  </Link>
);

export default HomePage;
