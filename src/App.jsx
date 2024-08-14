import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VideoList from "./components/VideoList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<VideoList />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
