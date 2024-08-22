import React from 'react';
import { Eye, ThumbsUp, ThumbsDown, MessageCircle, AlertTriangle, BarChart, Star, Award } from 'lucide-react';
import { calculateRecommendationScore } from "../utils/ratingCalculator";

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center p-4 bg-gray-100 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-md group">
    <Icon className="w-8 h-8 mb-2 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
    <span className="text-sm text-gray-500 mb-1">{label}</span>
    <span className="text-lg font-semibold text-gray-900">{value}</span>
  </div>
);

const VideoStats = ({ videoDetails, sentimentScore }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
    <Stat icon={Eye} label="Views" value={videoDetails.views.toLocaleString()} />
    <Stat icon={ThumbsUp} label="Likes" value={videoDetails.likes.toLocaleString()} />
    <Stat icon={ThumbsDown} label="Dislikes" value={videoDetails.dislikes.toLocaleString()} />
    <Stat icon={MessageCircle} label="Comments" value={videoDetails.comments.toLocaleString()} />
    <Stat
      icon={AlertTriangle}
      label="Comments Toxicity"
      value={sentimentScore === "N/A" || sentimentScore === "Error" ? sentimentScore : `${sentimentScore}%`}
    />
    <Stat icon={BarChart} label="Like/Dislike Ratio" value={`${videoDetails.likeDislikeRatio}%`} />
    <Stat icon={Star} label="Rating" value={`${videoDetails.rating.toFixed(3)}%`} />
    <Stat
      icon={Award}
      label="Recommendation Score"
      value={`${calculateRecommendationScore(
        videoDetails.likes,
        videoDetails.dislikes,
        videoDetails.views,
        videoDetails.comments
      ).toFixed(2)}%`}
    />
  </div>
);

export default VideoStats;