import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, ThumbsUp, ThumbsDown, BarChart, Star, MessageCircle } from "lucide-react";
import { getVideoDetails, getVideoComments } from "../services/youtubeService";
import { analyzeSentiment } from "../services/sentimentService";

const VideoDetailsPage = () => {
  const { videoId } = useParams();
  const [videoDetails, setVideoDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [sentimentScore, setSentimentScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const fetchedComments = await getVideoComments(videoId);
      setComments(fetchedComments);
      
      if (fetchedComments.length > 0) {
        const commentTexts = fetchedComments.map(comment => comment.text);
        console.log("Sending comments for analysis:", commentTexts);
        const sentimentResults = await analyzeSentiment(commentTexts);
        
        const totalSentiment = sentimentResults.reduce((sum, result) => sum + parseFloat(result.rating), 0);
        const averageSentiment = totalSentiment / sentimentResults.length;
        
        setSentimentScore(averageSentiment.toFixed(2));
      } else {
        setSentimentScore('N/A');
      }
    } catch (error) {
      console.error("Error fetching comments or analyzing sentiment:", error);
      setSentimentScore('Error');
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
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{videoDetails.title}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
  <Stat icon={Eye} label="Views" value={videoDetails.views.toLocaleString()} />
  <Stat icon={ThumbsUp} label="Likes" value={videoDetails.likes.toLocaleString()} />
  <Stat icon={ThumbsDown} label="Dislikes" value={videoDetails.dislikes.toLocaleString()} />
  <Stat icon={BarChart} label="Like/Dislike Ratio" value={`${videoDetails.likeDislikeRatio}%`} />
  <Stat icon={Star} label="Rating" value={videoDetails.rating} />
  <Stat icon={MessageCircle} label="Comments" value={videoDetails.comments.toLocaleString()} />
  <Stat icon={Star} label="Avg Sentiment" value={sentimentScore || 'N/A'} />
</div>
<button
  onClick={handleFetchComments}
  disabled={isLoading}
  className="bg-gray-500 mb-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  {isLoading ? 'Analyzing...' : 'Fetch Comments and Analyze Sentiment'}
</button>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 text-sm sm:text-base">{videoDetails.description}</p>
          </div>
        </div>
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