import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  ThumbsDown,
  BarChart,
  AlertTriangle,
  MessageCircle,
  Star,
  Award,
} from "lucide-react";
import LanguageDropdown from "../components/LanguageDropdown";
import { getVideoDetails, getVideoComments } from "../services/youtubeService";
import { analyzeSentiment } from "../services/sentimentService";
import { calculateRecommendationScore } from "../utils/ratingCalculator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const VideoDetailsPage = () => {
  const { videoId } = useParams();
  const [videoDetails, setVideoDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [sentimentScore, setSentimentScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(10);
  const [geminiAnalysis, setGeminiAnalysis] = useState("");
  const [analysisLanguage, setAnalysisLanguage] = useState("English");

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const details = await getVideoDetails(videoId);
        setVideoDetails(details);
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  const handleFetchComments = async () => {
    setIsLoading(true);
    try {
      const { comments: fetchedComments, geminiAnalysis } =
        await getVideoComments(videoId, commentCount, analysisLanguage);
      setComments(fetchedComments);

      if (fetchedComments.length > 0) {
        const validSentimentScores = fetchedComments
          .map((comment) => comment.sentimentScore)
          .filter((score) => score !== null);

        if (validSentimentScores.length > 0) {
          const averageSentiment =
            validSentimentScores.reduce((sum, score) => sum + score, 0) /
            validSentimentScores.length;
          setSentimentScore(averageSentiment.toFixed(2));
        } else {
          setSentimentScore("N/A");
        }
      } else {
        setSentimentScore("N/A");
      }

      // Set Gemini analysis
      setGeminiAnalysis(geminiAnalysis);
    } catch (error) {
      console.error("Error fetching comments or analyzing sentiment:", error);
      setSentimentScore("Error");
      setGeminiAnalysis("Error analyzing comments");
    } finally {
      setIsLoading(false);
    }
  };

  if (!videoDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/analytics"
        className="p-2 rounded inline-block mb-4 text-gray-600 hover:text-white hover:bg-black transition-colors duration-300"
        aria-label="Back to Analytics"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="p-16 sm:p-16">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
            {videoDetails.title}
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Stat
              icon={Eye}
              label="Views"
              value={videoDetails.views.toLocaleString()}
            />
            <Stat
              icon={ThumbsUp}
              label="Likes"
              value={videoDetails.likes.toLocaleString()}
            />
            <Stat
              icon={ThumbsDown}
              label="Dislikes"
              value={videoDetails.dislikes.toLocaleString()}
            />
            <Stat
              icon={MessageCircle}
              label="Comments"
              value={videoDetails.comments.toLocaleString()}
            />
            <Stat
              icon={AlertTriangle}
              label="Comments Toxicity"
              value={`${
                sentimentScore === "N/A" || sentimentScore === "Error"
                  ? sentimentScore
                  : `${sentimentScore}%`
              }`}
            />
            <Stat
              icon={BarChart}
              label="Like/Dislike Ratio"
              value={`${videoDetails.likeDislikeRatio}%`}
            />
            <Stat
              icon={Star}
              label="Rating"
              value={`${videoDetails.rating.toFixed(3)}%`}
            />
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
          <div className="flex flex-col sm:flex-row items-center justify-between mb-5 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/3">
              <label
                htmlFor="commentCount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number of comments to analyze
              </label>
              <input
                type="number"
                id="commentCount"
                value={commentCount}
                onChange={(e) =>
                  setCommentCount(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
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
        </div>
      </div>
      {geminiAnalysis && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Gemini Analysis
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className={`prose max-w-none ${
              analysisLanguage === "Arabic" ? "text-right" : ""
            }`}
            components={{
              p: ({ node, ...props }) => (
                <p
                  dir={analysisLanguage === "Arabic" ? "rtl" : "ltr"}
                  {...props}
                />
              ),
            }}
          >
            {geminiAnalysis}
          </ReactMarkdown>
        </div>
      )}
      {comments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Top 20 Comments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comments
              .slice(0, commentCount)
              .sort((a, b) => (b.sentimentScore || 0) - (a.sentimentScore || 0))
              .map((comment, index) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-500">
                      Rank #{index + 1}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        comment.sentimentScore < 33
                          ? "text-green-500"
                          : comment.sentimentScore < 66
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      Toxicity:{" "}
                      {comment.sentimentScore !== null
                        ? `${comment.sentimentScore.toFixed(2)}%`
                        : "N/A"}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.text}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
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
              ))}
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 text-sm sm:text-base">
          {videoDetails.description}
        </p>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center p-2 sm:p-4 bg-gray-100 rounded-lg">
    <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-gray-600" />
    <span className="text-xs sm:text-sm text-gray-600">{label}</span>
    <span className="text-sm sm:text-lg font-semibold">{value}</span>
  </div>
);

export default VideoDetailsPage;
