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
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/analytics"
        className="inline-flex items-center text-gray-600 hover:text-red-500 transition-colors duration-300 mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Analytics
      </Link>
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="p-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {videoDetails.title}
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
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
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/3">
              <label
                htmlFor="commentCount"
                className="block text-sm font-medium text-gray-600 mb-1"
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
        </div>
      </div>
      {geminiAnalysis && (
        <div className="mt-12 bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Gemini Analysis
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className={`prose max-w-none text-gray-700 ${
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
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Comments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comments
              .slice(0, commentCount)
              .sort((a, b) => (b.sentimentScore || 0) - (a.sentimentScore || 0))
              .map((comment, index) => (
                <CommentCard key={comment.id} comment={comment} index={index} />
              ))}
          </div>
        </div>
      )}
      <div className="mt-12 bg-gray-100 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
        <p className="text-gray-700">{videoDetails.description}</p>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center p-4 bg-gray-100 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-md group">
    <Icon className="w-8 h-8 mb-2 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
    <span className="text-sm text-gray-500 mb-1">{label}</span>
    <span className="text-lg font-semibold text-gray-900">{value}</span>
  </div>
);

const CommentCard = ({ comment, index }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm font-semibold text-gray-500">
        Rank #{index + 1}
      </span>
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
export default VideoDetailsPage;
