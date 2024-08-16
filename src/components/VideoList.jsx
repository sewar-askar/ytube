import React, { useContext, useMemo, useState } from "react";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import VideoItem from "./VideoItem";

const DropdownMenu = ({ selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-10 mb-4">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {selectedOption}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("Date (newest first)")}
            >
              Date (newest first)
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("Views")}
            >
              Views
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("Likes")}
            >
              Likes
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("Dislikes")}
            >
              Dislikes
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("Like/Dislike Ratio")}
            >
              Like/Dislike Ratio
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("Like/Views Ratio")}
            >
              Like/Views Ratio
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoList = () => {
  const { videos, sortBy, setSortBy } = useContext(VideoAnalyticsContext);

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

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-centerspace-y-6 m-5">
      <DropdownMenu selectedOption={sortBy} setSelectedOption={setSortBy} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVideos.map((video) => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoList;
