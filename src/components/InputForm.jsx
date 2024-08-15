import React, { useState, useContext } from "react";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import { getVideos } from "../services/youtubeService";
import {
  UploadCloud,
  Search,
  Youtube,
  ListVideo,
  Film,
  BarChart3,
} from "lucide-react";

const InputForm = ({ type }) => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const { setVideos, setIsLoading, setError, clearVideos } = useContext(
    VideoAnalyticsContext
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    clearVideos();

    try {
      if (type === "json") {
        if (!file) {
          throw new Error("Please select a JSON file");
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
          const json = JSON.parse(e.target.result);
          await getVideos(json, type, setVideos);
        };
        reader.readAsText(file);
      } else {
        await getVideos(input, type, setVideos);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = () => {
    const inputClasses =
      "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-gray-600";

    let icon;
    switch (type) {
      case "search":
        icon = <Search className="text-gray-500 w-6 h-6" />;
        break;
      case "channel":
        icon = <Youtube className="text-gray-500 w-6 h-6" />;
        break;
      case "playlist":
        icon = <ListVideo className="text-gray-500 w-6 h-6" />;
        break;
      case "video":
        icon = <Film className="text-gray-500 w-6 h-6" />;
        break;
      case "json":
        icon = <UploadCloud className="text-gray-500 w-6 h-6" />;
        break;
      default:
        icon = null;
    }

    return (
      <div className="mb-4 w-full flex items-center space-x-2">
        {icon}
        <input
          type={type === "json" ? "file" : "text"}
          value={type !== "json" ? input : undefined}
          onChange={(e) =>
            type !== "json"
              ? setInput(e.target.value)
              : setFile(e.target.files[0])
          }
          placeholder={`Enter ${
            type === "search" ? "search query" : `YouTube ${type} URL`
          }`}
          className={inputClasses}
          accept={type === "json" ? ".json" : undefined}
        />
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg space-y-4"
    >
      {renderInput()}
      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
      >
        <BarChart3 className="w-5 h-5 mr-3" />
        Get Insights
      </button>
    </form>
  );
};

export default InputForm;
