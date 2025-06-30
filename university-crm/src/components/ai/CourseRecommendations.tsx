import React, { useState } from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { api } from "../../services/api";
import { Course } from "../../types";

interface CourseRecommendationsProps {
  onRecommendationClick?: (course: Course) => void;
}

export const CourseRecommendations: React.FC<CourseRecommendationsProps> = ({
  onRecommendationClick,
}) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [interests, setInterests] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (!interests.trim()) {
      setError("Please enter your interests");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/ai/recommend", {
        interests: interests.trim(),
        currentLevel: "undergraduate", // Could be made dynamic
      });

      setRecommendations(response.data.recommendations || []);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to get recommendations"
      );
      console.error("Error getting recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Course Recommendations</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are your interests or career goals?
          </label>
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., I'm interested in machine learning, data science, and want to work in AI research..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <button
          onClick={handleGetRecommendations}
          disabled={loading || !interests.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner size="sm" /> : "Get Recommendations"}
        </button>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Recommended Courses:</h4>
            {recommendations.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => onRecommendationClick?.(course)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {course.title}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {course.credits} credits
                      </span>
                      {course.difficulty && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {course.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRecommendations;
