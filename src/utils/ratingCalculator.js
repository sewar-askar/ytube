export const calculateRating = (video) => {
  // Normalize values using log scaling
  const normalize = (value) => Math.log(value + 1);
  const likes = normalize(video.likes);
  const dislikes = normalize(video.dislikes);
  const comments = normalize(video.comments);
  const views = normalize(video.views);

  // Calculate engagement rate (likes + comments per view)
  const engagementRate = (likes + comments) / views;

  // Calculate like-dislike ratio
  const likeRatio = likes / (likes + dislikes + 1); // Add 1 to avoid division by zero

  // Combine scores with weights and scale down
  const rawScore = (0.6 * engagementRate + 0.4 * likeRatio) * 50;

  // Apply a more aggressive sigmoid function
  const sigmoid = (x) => 100 / (1 + Math.exp(-0.05 * (x - 25)));
  const finalScore = sigmoid(rawScore);

  return Math.max(1, Math.min(99, finalScore)).toFixed(2);
};