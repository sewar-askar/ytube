import React from "react";
import { useNavigate } from "react-router-dom";

const SelectionPage = () => {
  const navigate = useNavigate();

  const handleSelection = (type) => {
    navigate("/video-list", { state: { type } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select an Option</h1>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => handleSelection("video")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Single Video
        </button>
        <button
          onClick={() => handleSelection("search")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Search Query
        </button>
        <button
          onClick={() => handleSelection("channel")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          YouTube Channel
        </button>
        <button
          onClick={() => handleSelection("playlist")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          YouTube Playlist
        </button>
      </div>
    </div>
  );
};

export default SelectionPage;
