import axios from "axios";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";

export const analyzeCommentsWithGemini = async (comments) => {
  try {
    const prompt = `Analyze and summarize the following YouTube comments, focusing on factual feedback. Exclude irrelevant or off-topic comments.  Provide detailed summaries in Arabic, structured in markdown format as follows:

YouTube Comments Analysis
Pros:
Detail each positive aspect mentioned by users with specific examples.
Cons:
Detail each negative aspect or criticism mentioned by users with specific examples.
Common Suggestions:
Summarize recurring suggestions or feedback that appear across multiple comments.
Actionable Insights:
Provide recommendations or actionable steps based on the analysis of pros, cons, and suggestions. Highlight areas for improvement or content strategies that could address the feedback.
  
  ${comments.join("\n")}`;

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
