import React from "react";

const CommentCard = ({ comment }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <span
        className={`text-sm font-semibold px-3 py-1 rounded-full ${
          comment.sentimentScore < 33
            ? "bg-green-100 text-green-800"
            : comment.sentimentScore < 66
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        Toxicity:{" "}
        {comment.sentimentScore !== null
          ? `${comment.sentimentScore.toFixed(2)}%`
          : "N/A"}
      </span>
    </div>
    <p className="text-gray-700 mb-4">{comment.text}</p>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`rounded-full h-2 ${
          comment.sentimentScore < 33
            ? "bg-green-500"
            : comment.sentimentScore < 66
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
        style={{ width: `${comment.sentimentScore}%` }}
      ></div>
    </div>
  </div>
);

const CommentList = ({ comments }) => {
  if (comments.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
