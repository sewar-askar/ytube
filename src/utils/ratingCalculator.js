export const calculateRecommendationScore = (likes, dislikes, views, commentCount) => {
  // Calculate engagement rate
  const engagementRate = views > 0 ? (likes + dislikes + commentCount) / views : 0;
  
  // Calculate like ratio
  const likeRatio = (likes + dislikes) > 0 ? likes / (likes + dislikes) : 0;
  
  // Calculate comment ratio
  const commentRatio = views > 0 ? commentCount / views : 0;
  
  // Weigh the components
  const engagementWeight = 0.4;
  const likeRatioWeight = 0.4;
  const commentRatioWeight = 0.2;
  
  // Calculate the final score
  const recommendationScore = (
    engagementRate * engagementWeight +
    likeRatio * likeRatioWeight +
    commentRatio * commentRatioWeight
  );
  
  return recommendationScore * 100; // Scale to 0-100 for easier interpretation
};