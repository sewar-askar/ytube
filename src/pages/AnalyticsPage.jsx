import React, { useContext, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import VideoList from "../components/VideoList";
import InputForm from "../components/InputForm";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";

const AnalyticsPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const { clearVideos } = useContext(VideoAnalyticsContext);

  useEffect(() => {
    if (!type) {
      navigate("/");
    } else {
      clearVideos();
    }
  }, [type, navigate, clearVideos]);

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/"
        className="bg-blue-500 text-white p-2 rounded inline-block mb-4"
      >
        Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-4">YouTube Video Analytics</h1>
      <InputForm type={type} />
      <VideoList />
    </div>
  );
};

export default AnalyticsPage;
