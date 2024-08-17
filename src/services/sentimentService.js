import { analyzeSentimentApi } from '../api/perspectiveApi';

export const analyzeSentiment = async (comments) => {
  try {
    const sentimentScores = await Promise.all(
      comments.map(async (comment) => {
        try {
          const response = await analyzeSentimentApi(comment);
          return response.attributeScores.TOXICITY.summaryScore.value * 100;
        } catch (error) {
          console.error('Error analyzing sentiment for comment:', error);
          return null;
        }
      })
    );
    return sentimentScores;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};