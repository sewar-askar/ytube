import React, { useContext, useMemo, useState } from "react";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import VideoItem from "./VideoItem";
import { ChevronDown } from "lucide-react";
import { calculateSuperFilterScore } from "../utils/ratingCalculator";

const DropdownMenu = ({ selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (value, label) => {
    setSelectedOption(value);
    setIsOpen(false);
    document.getElementById("menu-button").innerText = label;
  };

  return (
    <div className="relative inline-block text-left  z-10 mt-6">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-gray-950 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {selectedOption}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
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
              onClick={() => selectOption("publishedAt", "Date (newest first)")}
            >
              Date (newest first)
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("views", "Views")}
            >
              Views
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("likes", "Likes")}
            >
              Likes
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("dislikes", "Dislikes")}
            >
              Dislikes
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() =>
                selectOption("likeDislikeRatio", "Like/Dislike Ratio")
              }
            >
              Like/Dislike Ratio
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("ratio", "Like/Views Ratio")}
            >
              Like/Views Ratio
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() =>
                selectOption("recommendationScore", "Recommendation Score")
              }
            >
              Recommendation Score
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("superFilter", "Super Filter")}
            >
              Super Filter
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              onClick={() => selectOption("rating", "Rating")}
            >
              Rating
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

    if (sortBy === "superFilter") {
      return calculateSuperFilterScore(videos);
    }

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
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "recommendationScore":
          return (
            parseFloat(b.recommendationScore) -
            parseFloat(a.recommendationScore)
          );
        default:
          return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });
  }, [videos, sortBy]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <>
      {" "}
      <DropdownMenu selectedOption={sortBy} setSelectedOption={setSortBy} />
      <div className="flex flex-col items-center justify-center space-y-6 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map((video) => (
            <VideoItem key={video.id} video={video} />
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoList;
