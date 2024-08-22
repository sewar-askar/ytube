import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LanguageDropdown from "../components/LanguageDropdown";
import { getVideoDetails, getVideoComments } from "../services/youtubeService";
import { calculateRecommendationScore } from "../utils/ratingCalculator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import VideoStats from "../components/VideoStats";
import CommentAnalysisForm from "../components/CommentAnalysisForm";
import GeminiAnalysis from "../components/GeminiAnalysis";
import CommentList from "../components/CommentList";

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
    fetchVideoDetails();
  }, [videoId]);

  const fetchVideoDetails = async () => {
    try {
      const details = await getVideoDetails(videoId);
      setVideoDetails(details);
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  const handleFetchComments = async () => {
    setIsLoading(true);
    try {
      const { comments: fetchedComments, geminiAnalysis } =
        await getVideoComments(videoId, commentCount, analysisLanguage);
      setComments(fetchedComments);
      updateSentimentScore(fetchedComments);
      setGeminiAnalysis(geminiAnalysis);
    } catch (error) {
      console.error("Error fetching comments or analyzing sentiment:", error);
      setSentimentScore("Error");
      setGeminiAnalysis("Error analyzing comments");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSentimentScore = (fetchedComments) => {
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
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        ></iframe>
        <div className="p-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {videoDetails.title}
          </h1>
          <VideoStats
            videoDetails={videoDetails}
            sentimentScore={sentimentScore}
          />
          <CommentAnalysisForm
            commentCount={commentCount}
            setCommentCount={setCommentCount}
            analysisLanguage={analysisLanguage}
            setAnalysisLanguage={setAnalysisLanguage}
            handleFetchComments={handleFetchComments}
            isLoading={isLoading}
          />
        </div>
      </div>
      <GeminiAnalysis
        geminiAnalysis={geminiAnalysis}
        analysisLanguage={analysisLanguage}
      />
      <CommentList comments={comments} />
      <div className="mt-12 bg-gray-100 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
        <p className="text-gray-700">{videoDetails.description}</p>
      </div>
    </div>
  );
};

export default VideoDetailsPage;
