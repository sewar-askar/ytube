import React, { useState, useContext, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import VideoList from "../components/VideoList";
import InputForm from "../components/InputForm";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import { ArrowLeft, Loader } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getVideos } from "../services/youtubeService";

const AnalyticsPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const { clearVideos, setVideos } = useContext(VideoAnalyticsContext);
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!type) {
      navigate("/");
    } else {
      clearVideos();
    }
  }, [type, navigate, clearVideos]);

  const handleFetchVideos = async (input) => {
    setLoadingProgress(0);
    setIsLoading(true);

    try {
      const totalVideos = await getVideos(
        input,
        type,
        (updatedVideos, progress) => {
          setVideos(updatedVideos);
          setLoadingProgress(progress);
        }
      );

      setLoadingProgress(100);
    } catch (error) {
      setLoadingProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const pageTitle = type
    ? `YouTube ${
        type === "links"
          ? "Links"
          : type.charAt(0).toUpperCase() + type.slice(1)
      } Analytics`
    : "YouTube Video Analytics";

  return (
    <div className="container mx-auto p-4 relative">
      <Link
        to="/"
        className="p-2 rounded inline-block mb-4 text-gray-900 hover:text-white hover:bg-red-500 transition-colors duration-300"
        aria-label="Back to Home"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">{pageTitle}</h1>
      <InputForm
        type={type}
        setLoadingProgress={setLoadingProgress}
        setIsLoading={setIsLoading}
        clearVideos={clearVideos}
        setVideos={setVideos}
      />
      {isLoading && loadingProgress !== null && loadingProgress < 100 && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-white">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto ">
              <CircularProgressbar
                value={loadingProgress}
                text={`${loadingProgress.toFixed(0)}%`}
                styles={buildStyles({
                  pathColor: `#FF0000`,
                  textColor: "#FF0000",
                  trailColor: "#e5e7eb",
                  textSize: "14px",
                })}
              />
            </div>
            <div className="mt-2 text-base text-gray-900 font-bold ">
              Loading ...
            </div>
          </div>
        </div>
      )}

      <VideoList />
    </div>
  );
};

export default AnalyticsPage;