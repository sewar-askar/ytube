import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChannelVideos } from "../services/youtubeService";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";

export const useChannelVideos = (submitChannelUrl) => {
  const { setVideos } = useContext(VideoAnalyticsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  useQuery({
    queryKey: ["videos", submitChannelUrl],
    queryFn: () => getChannelVideos(submitChannelUrl, setVideos),
    enabled: !!submitChannelUrl,
    onSuccess: () => {
      setIsLoading(false);
      setIsError(false);
    },
    onError: (err) => {
      setIsLoading(false);
      setIsError(true);
      setError(err);
    },
  });

  return {
    isLoading,
    isError,
    error,
  };
};
