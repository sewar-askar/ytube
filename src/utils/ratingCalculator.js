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
  
  return recommendationScore * 200; 
};

export const calculateSuperFilterScore = (videos) => {
  const subFilters = ['rating', 'likeDislikeRatio', 'likeViewRatio', 'recommendationScore'];
  const weights = {
    rating: 28.5,
    likeDislikeRatio: 57.5,
    likeViewRatio: 14,
    recommendationScore: 0
  };
  const normalizedScores = {};

  subFilters.forEach(filter => {
    const validValues = videos
      .map(video => parseFloat(video[filter]))
      .filter(value => !isNaN(value) && isFinite(value));

    if (validValues.length === 0) {
      normalizedScores[filter] = videos.map(() => 0);
      return;
    }

    const max = Math.max(...validValues);
    const min = Math.min(...validValues);

    normalizedScores[filter] = videos.map(video => {
      const value = parseFloat(video[filter]);
      if (isNaN(value) || !isFinite(value)) return 0;
      return max === min ? 1 : (value - min) / (max - min);
    });
  });

  return videos.map((video, index) => {
    const superScore = subFilters.reduce((sum, filter) => {
      const score = normalizedScores[filter][index];
      const weightedScore = score * weights[filter];
      console.log(`${filter}: normalized=${score}, weighted=${weightedScore}`);
      return sum + (isNaN(score) ? 0 : weightedScore);
    }, 0);
    console.log(`Total superScore: ${superScore}`);
    return { ...video, superScore };
  }).sort((a, b) => b.superScore - a.superScore);
};