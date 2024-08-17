import React from "react";
import { Eye, ThumbsUp, ThumbsDown, BarChart, Link2, Star, MessageCircle, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateRecommendationScore } from "../utils/ratingCalculator";

const VideoItem = ({ video }) => {

  const rating = video.rating;

  console.log(video);

  return (
    <Link to={`/video/${video.id}`} className="block">
      <div className="transition duration-300 transform hover:-translate-y-1 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900">{video.title}</h2>
          <div className="mt-2 space-y-2">
            <p className="flex items-center text-gray-600">
              <Eye className="w-5 h-5 mr-2" />
              {video.views.toLocaleString()} Views
            </p>
            <p className="flex items-center text-gray-600">
              <ThumbsUp className="w-5 h-5 mr-2" />
              {video.likes.toLocaleString()} Likes
            </p>
            <p className="flex items-center text-gray-600">
              <ThumbsDown className="w-5 h-5 mr-2" />
              {video.dislikes.toLocaleString()} Dislikes
            </p>
            <p className="flex items-center text-gray-600">
  <MessageCircle className="w-5 h-5 mr-2" />
  {video.comments.toLocaleString()} Comments
</p>
            <p className="flex items-center text-gray-600">
              <BarChart className="w-5 h-5 mr-2" />
              Like/Dislike Ratio: {video.likeDislikeRatio}%
            </p>
            <p className="flex items-center text-gray-600">
              <BarChart className="w-5 h-5 mr-2" />
              Like/Views Ratio: {video.likeViewRatio}%
            </p>
            <p className="flex items-center text-gray-600">
  <Star className="w-5 h-5 mr-2" />
  Rating: {rating}
</p>
<p className="flex items-center text-gray-600">
  <Award className="w-5 h-5 mr-2" />
  Recommendation Score: {calculateRecommendationScore(video.likes, video.dislikes, video.views, video.comments).toFixed(2)}%
</p>
          </div>
          <div>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-gray-700 hover:underline hover:text-gray-900 transition-colors duration-300"
        >
          <Link2 className="inline-block w-5 h-5 mr-1" />
          Watch Video
        </a>
      </div>
        </div>
       
      </div>
    </Link>
  );
};

export default VideoItem;