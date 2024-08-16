import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { VideoAnalyticsProvider } from "./context/VideoAnalyticsContext";
import HomePage from "./pages/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import VideoDetailsPage from "./pages/VideoDetailsPage";


function App() {
  return (
    <VideoAnalyticsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/video/:videoId" element={<VideoDetailsPage />} />
        </Routes>
      </Router>
    </VideoAnalyticsProvider>
  );
}

export default App;
