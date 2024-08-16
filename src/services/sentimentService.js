import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:5000';

const MAX_COMMENT_LENGTH = 500; // Increased to a more reasonable value

const splitComment = (comment) => {
  if (comment.length <= MAX_COMMENT_LENGTH) {
    return [comment];
  }
  const chunks = [];
  for (let i = 0; i < comment.length; i += MAX_COMMENT_LENGTH) {
    chunks.push(comment.slice(i, i + MAX_COMMENT_LENGTH));
  }
  return chunks;
};

const formatCommentsWithIds = (comments) => {
  let formattedComments = [];
  let id = 1;
  comments.forEach((comment) => {
    const chunks = splitComment(comment);
    chunks.forEach((chunk) => {
      formattedComments.push({
        Id: id.toString(),
        comment: chunk
      });
      id++;
    });
  });
  return formattedComments;
};

export const analyzeSentiment = async (comments) => {
  try {
    const formattedComments = formatCommentsWithIds(comments);
    console.log("Sending to sentiment API:", formattedComments); // Debugging
    const response = await axios.post(`${API_BASE_URL}/prediction`, formattedComments);
    return response.data;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};