import React from 'react';
import LanguageDropdown from "./LanguageDropdown";

const CommentAnalysisForm = ({
  commentCount,
  setCommentCount,
  analysisLanguage,
  setAnalysisLanguage,
  handleFetchComments,
  isLoading
}) => (
  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
    <div className="w-full sm:w-1/3">
      <label htmlFor="commentCount" className="block text-sm font-medium text-gray-600 mb-1">
        Number of comments to analyze
      </label>
      <input
        type="number"
        id="commentCount"
        value={commentCount}
        onChange={(e) => setCommentCount(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        min="1"
      />
    </div>
    <LanguageDropdown
      selectedLanguage={analysisLanguage}
      setSelectedLanguage={setAnalysisLanguage}
    />
    <button
      onClick={handleFetchComments}
      disabled={isLoading}
      className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Analyzing...
        </span>
      ) : (
        "Fetch Comments and Analyze Sentiment"
      )}
    </button>
  </div>
);

export default CommentAnalysisForm;