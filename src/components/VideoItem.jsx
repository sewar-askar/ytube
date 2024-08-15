import React from "react";

const VideoItem = ({ video }) => {
  return (
    <div key={video.id} className="border p-4 rounded shadow">
      <img src={video.thumbnail} alt={video.title} className="w-full" />
      <h2 className="font-bold mt-2">{video.title}</h2>
      <p className="text-sm text-gray-600">
        Published: {new Date(video.publishedAt).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">
        Views: {(video.views || 0).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        Likes: {(video.likes || 0).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        Dislikes: {(video.dislikes || 0).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        Like/Dislike Ratio: {video.likeDislikeRatio}%
      </p>
      <p className="text-sm text-gray-600">
        Like/Views Ratio: {video.likeViewRatio}%
      </p>
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Watch Video
      </a>
    </div>
  );
};

export default VideoItem;
