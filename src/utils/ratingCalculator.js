export const calculateRating = (video) => {
    const likeRatio = (video.likes / (video.likes + video.dislikes)) * 100;
    const dislikeRatio = (video.dislikes / (video.likes + video.dislikes)) * 100;
    const engagementRate = ((video.likes + video.dislikes) / video.views) * 100;
    const baseScore = 0.7 * likeRatio - 0.3 * dislikeRatio;
    const viewImpact = Math.log10(video.views + 1);
    const rating = (baseScore * viewImpact) / 10;
    return Math.min(Math.max(rating, 0), 100).toFixed(2);
  };