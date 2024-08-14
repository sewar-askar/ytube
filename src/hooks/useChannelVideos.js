import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChannelVideos } from "../services/youtubeService";

export const useChannelVideos = (submitChannelUrl) => {
  const [videos, setVideos] = useState([]);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["videos", submitChannelUrl],
    queryFn: () => getChannelVideos(submitChannelUrl, setVideos),
    enabled: !!submitChannelUrl,
  });

  return {
    videos,
    isLoading,
    isError,
    error,
    setVideos,
  };
};
