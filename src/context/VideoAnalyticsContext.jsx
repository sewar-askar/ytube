import React, { createContext, useState, useCallback } from "react";

export const VideoAnalyticsContext = createContext();

export const VideoAnalyticsProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [sortBy, setSortBy] = useState("publishedAt");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearVideos = useCallback(() => {
    setVideos([]);
    setError(null);
  }, []);

  return (
    <VideoAnalyticsContext.Provider
      value={{
        videos,
        setVideos,
        sortBy,
        setSortBy,
        isLoading,
        setIsLoading,
        error,
        setError,
        clearVideos,
      }}
    >
      {children}
    </VideoAnalyticsContext.Provider>
  );
};
