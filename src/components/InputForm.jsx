import React, { useState, useContext } from "react";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import { getVideos } from "../services/youtubeService";

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
    switch (type) {
      case "search":
        return (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter search query"
            className="border p-2 mr-2 w-64"
          />
        );
      case "channel":
        return (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter YouTube Channel URL"
            className="border p-2 mr-2 w-64"
          />
        );
      case "playlist":
        return (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter YouTube Playlist URL"
            className="border p-2 mr-2 w-64"
          />
        );
      case "video":
        return (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter YouTube Video URL"
            className="border p-2 mr-2 w-64"
          />
        );
      case "json":
        return (
          <input
            type="file"
            accept=".json"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 mr-2 w-64"
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {renderInput()}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Fetch Videos
      </button>
    </form>
  );
};

export default InputForm;
