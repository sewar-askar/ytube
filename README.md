# YouTube Video Analytics

## Description

YouTube Video Analytics is a powerful React application that provides in-depth analysis and insights for YouTube videos, channels, and playlists. It offers a user-friendly interface to analyze video performance, sentiment, and engagement metrics.

## Features

- Analyze individual videos, channels, playlists, or search results
- Fetch and display comprehensive video statistics (views, likes, dislikes, comments)
- Calculate and visualize engagement metrics (like/dislike ratio, recommendation score)
- Perform sentiment analysis on video comments
- Generate AI-powered analysis of comments using Gemini API
- Sort and filter videos based on various metrics
- Support for multiple languages in analysis (currently English and Arabic)

## Technologies Used

- React
- Vite
- Tailwind CSS
- Axios for API requests
- React Router for navigation
- Lucide React for icons
- React Circular Progressbar for visual representations

## APIs Used

- YouTube Data API v3
- Return YouTube Dislike API
- Perspective API for sentiment analysis
- Gemini API for AI-powered comment analysis

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/youtube-video-analytics.git
   ```

2. Navigate to the project directory:

   ```
   cd youtube-video-analytics
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your API keys:

   ```
   VITE_YOUTUBE_API_KEY=your_youtube_api_key
   VITE_PERSPECTIVE_API_KEY=your_perspective_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Open the application in your browser.
2. Choose the type of analysis you want to perform (search, channel, playlist, or single video).
3. Enter the required information (URL, search query, etc.).
4. Click "Get Insights" to fetch and analyze the data.
5. Explore the detailed analytics and insights provided for each video.

## Project Structure

The project follows a modular structure with components, pages, services, and utilities separated for better organization and maintainability. Key directories include:

- `src/components`: Reusable React components
- `src/pages`: Main page components
- `src/services`: API and data processing services
- `src/utils`: Utility functions and helpers
- `src/context`: React context for state management
- `src/api`: API integration modules

## License

This project is licensed under the MIT License.
