import React, { useState } from "react";
import {
  UploadCloud,
  Search,
  Youtube,
  ListVideo,
  Film,
  BarChart3,
  FileText,
  Link,
} from "lucide-react";
import { getVideos } from "../services/youtubeService";

const InputForm = ({
  type,
  setLoadingProgress,
  setIsLoading,
  clearVideos,
  setVideos,
}) => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [videoLimit, setVideoLimit] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearVideos();
  
    try {
      if (type === "json" || type === "csv") {
        if (!file) {
          throw new Error(`Please select a ${type.toUpperCase()} file`);
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
          let data;
          if (type === "json") {
            data = JSON.parse(e.target.result);
          } else {
            // CSV parsing
            data = e.target.result.split('\n').map(row => row.split(',')[0].trim());
          }
          await getVideos(data, type, (videos, progress) => {
            setVideos(videos);
            setLoadingProgress(progress);
          });
          setLoadingProgress(100);
          setIsLoading(false);
        };
        reader.readAsText(file);
      } else {
        await getVideos(input, type, (videos, progress) => {
          setVideos(videos);
          setLoadingProgress(progress);
        }, videoLimit);
        setLoadingProgress(100);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setLoadingProgress(null);
      setIsLoading(false);
    }
  };
  const renderInput = () => {
    const inputClasses =
      "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-gray-600";

    let icon;
    switch (type) {
      case "search":
        icon = <Search className="text-gray-500 w-5 h-5" />;
        break;
      case "channel":
        icon = <Youtube className="text-gray-500 w-5 h-5" />;
        break;
      case "playlist":
        icon = <ListVideo className="text-gray-500 w-5 h-5" />;
        break;
      case "video":
        icon = <Film className="text-gray-500 w-5 h-5" />;
        break;
      case "json":
        icon = <UploadCloud className="text-gray-500 w-5 h-5" />;
        break;
      case "csv":
        icon = <FileText className="text-gray-500 w-5 h-5" />;
        break;
      case "links":
        icon = <Link className="text-gray-500 w-5 h-5" />;
        break;
      default:
        icon = null;
    }
  
    return (
      <div className="w-full space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
          <input
            type={type === "json" || type === "csv" ? "file" : "text"}
            value={type !== "json" && type !== "csv" ? input : undefined}
            onChange={(e) =>
              type !== "json" && type !== "csv"
                ? setInput(e.target.value)
                : setFile(e.target.files[0])
            }
            placeholder={`Enter ${
              type === "search" ? "search query" : type === "links" ? "YouTube video links separated by commas" : `YouTube ${type} URL`
            }`}
            className={`${inputClasses} pl-10`}
            accept={type === "json" ? ".json" : type === "csv" ? ".csv" : undefined}
          />
        </div>
        {type === "search" && (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={videoLimit}
              onChange={(e) => setVideoLimit(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              placeholder="Video limit"
              className={`${inputClasses} w-1/3`}
              min="1"
              max="200"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Video limit (1-50)
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6 max-w-md mx-auto"
    >
      {renderInput()}
      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition duration-300"
      >
        <BarChart3 className="w-5 h-5 mr-2" />
        Get Insights
      </button>
    </form>
  );
};

export default InputForm;