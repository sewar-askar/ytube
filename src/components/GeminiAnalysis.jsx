import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const GeminiAnalysis = ({ geminiAnalysis, analysisLanguage }) => {
  if (!geminiAnalysis) return null;

  return (
    <div className="mt-12 bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gemini Analysis</h2>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className={`prose max-w-none text-gray-700 ${
          analysisLanguage === "Arabic" ? "text-right" : ""
        }`}
        components={{
          p: ({ node, ...props }) => (
            <p dir={analysisLanguage === "Arabic" ? "rtl" : "ltr"} {...props} />
          ),
        }}
      >
        {geminiAnalysis}
      </ReactMarkdown>
    </div>
  );
};

export default GeminiAnalysis;