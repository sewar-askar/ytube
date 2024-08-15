import React, { useContext, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import VideoList from "../components/VideoList";
import InputForm from "../components/InputForm";
import { VideoAnalyticsContext } from "../context/VideoAnalyticsContext";
import { ArrowLeft } from "lucide-react";

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

  // Capitalize the first letter of the type for display
  const pageTitle = type
    ? `YouTube ${type.charAt(0).toUpperCase() + type.slice(1)} Analytics`
    : "YouTube Video Analytics";

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/"
        className="p-2 rounded inline-block mb-4 text-gray-600 hover:text-white hover:bg-black transition-colors duration-300"
        aria-label="Back to Home"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
      <InputForm type={type} />
      <VideoList />
    </div>
  );
};

export default AnalyticsPage;
