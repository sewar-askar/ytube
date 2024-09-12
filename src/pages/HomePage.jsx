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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-7xl w-full">
        <header className="mb-16 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">
              YouTube
            </span>{" "}
            Video Analyzer
          </h1>
          <p className="text-xl text-gray-700 mt-6 max-w-2xl mx-auto leading-relaxed">
            Analyze YouTube videos effortlessly using various sources such as
            Search Queries, Channels, Playlists, or even a single video.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <AnalyzerButton
            to="/analytics?type=search"
            icon={Search}
            label="Search Query"
            gradient="from-blue-500 to-blue-600"
          />
          <AnalyzerButton
            to="/analytics?type=channel"
            icon={Youtube}
            label="YouTube Channel"
            gradient="from-red-500 to-red-600"
          />
          <AnalyzerButton
            to="/analytics?type=playlist"
            icon={PlaySquare}
            label="YouTube Playlist"
            gradient="from-green-500 to-green-600"
          />
          <AnalyzerButton
            to="/analytics?type=video"
            icon={Film}
            label="Single Video"
            gradient="from-yellow-500 to-yellow-600"
          />
          <AnalyzerButton
            to="/analytics?type=json"
            icon={FileJson}
            label="JSON File"
            gradient="from-purple-500 to-purple-600"
          />
          <AnalyzerButton
            to="/analytics?type=csv"
            icon={FileText}
            label="CSV File"
            gradient="from-pink-500 to-pink-600"
          />
          <AnalyzerButton
            to="/analytics?type=links"
            icon={LinkIcon}
            label="Links as Text"
            gradient="from-indigo-500 to-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};

const AnalyzerButton = ({ to, icon: Icon, label, gradient }) => (
  <Link
    to={to}
    className="block transform transition duration-300 hover:scale-105 hover:-rotate-1 hover:z-10"
  >
    <div className={`bg-gradient-to-br ${gradient} text-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl`}>
      <div className="p-8 flex flex-col items-center">
        <Icon className="w-16 h-16 mb-4" />
        <div className="text-xl font-semibold text-center">{label}</div>
      </div>
      <div className="bg-white bg-opacity-10 p-4">
        <div className="text-sm text-center">
          Analyze YouTube content using {label}
        </div>
      </div>
    </div>
  </Link>
);

export default HomePage;
