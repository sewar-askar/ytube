import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import { Search, Youtube, PlaySquare, Film, FileJson, FileText, LinkIcon} from "lucide-react";

const HomePage = () => {
  const { clearVideos } = useContext(VideoAnalyticsContext);

  useEffect(() => {
    clearVideos();
  }, [clearVideos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col justify-center items-center p-6 dark:bg-gray-900 dark:from-gray-800 dark:to-gray-700">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
          YouTube Video Analyzer
        </h1>
        <p className="text-xl text-gray-950 mt-4 max-w-2xl mx-auto dark:text-gray-300">
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
    <div className="group transform transition  duration-300 hover:scale-105 hover:shadow-lg rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-900 hover:border-gray-900 hover:text-white">
      <div className="p-8 flex items-center space-x-4 transition-all duration-300 group-hover:bg-gray-900 group-hover:text-white">
        <Icon className="w-8 h-8 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
        <div className="text-xl font-medium group-hover:text-white transition-colors duration-300">
          {label}
        </div>
      </div>
      <div className="p-4 transition-all duration-300 group-hover:bg-gray-950 group-hover:text-gray-300">
        <div className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          Analyze YouTube content using {label}.
        </div>
      </div>
    </div>
  </Link>
);

export default HomePage;
