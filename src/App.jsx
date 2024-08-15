import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { VideoAnalyticsProvider } from "./context/VideoAnalyticsContext";
import HomePage from "./pages/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  return (
    <VideoAnalyticsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Router>
    </VideoAnalyticsProvider>
  );
}

export default App;
