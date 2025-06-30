import React, { useState } from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { api } from "../../services/api";

interface SyllabusGeneratorProps {
  courseId?: string;
  onSyllabusGenerated?: (syllabus: string) => void;
}

interface SyllabusResponse {
  syllabus: string;
  topics: string[];
  learningObjectives: string[];
  assessmentPlan: string[];
}

export const SyllabusGenerator: React.FC<SyllabusGeneratorProps> = ({
  courseId,
  onSyllabusGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState<SyllabusResponse | null>(null);
  const [topic, setTopic] = useState("");
  const [courseLevel, setCourseLevel] = useState("undergraduate");
  const [duration, setDuration] = useState("semester");
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSyllabus = async () => {
    if (!topic.trim()) {
      setError("Please enter a course topic");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/ai/syllabus", {
        topic: topic.trim(),
        level: courseLevel,
        duration: duration,
        courseId: courseId,
      });

      setSyllabus(response.data);
      onSyllabusGenerated?.(response.data.syllabus);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to generate syllabus");
      console.error("Error generating syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadSyllabus = () => {
    if (!syllabus) return;

    const content = `# Course Syllabus: ${topic}

## Learning Objectives
${syllabus.learningObjectives.map((obj) => `- ${obj}`).join("\n")}

## Course Topics
${syllabus.topics.map((topic, index) => `${index + 1}. ${topic}`).join("\n")}

## Assessment Plan
${syllabus.assessmentPlan.map((assessment) => `- ${assessment}`).join("\n")}

## Detailed Syllabus
${syllabus.syllabus}
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.replace(/[^a-zA-Z0-9]/g, "_")}_syllabus.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">AI Syllabus Generator</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Introduction to Machine Learning"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Level
            </label>
            <select
              value={courseLevel}
              onChange={(e) => setCourseLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semester">Semester (16 weeks)</option>
              <option value="quarter">Quarter (10 weeks)</option>
              <option value="summer">Summer (8 weeks)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateSyllabus}
          disabled={loading || !topic.trim()}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner size="sm" /> : "Generate Syllabus"}
        </button>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {syllabus && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Generated Syllabus</h4>
              <button
                onClick={downloadSyllabus}
                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200"
              >
                Download
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-800">
                  Learning Objectives:
                </h5>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                  {syllabus.learningObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-800">Course Topics:</h5>
                <ol className="list-decimal list-inside text-sm text-gray-600 mt-1 space-y-1">
                  {syllabus.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h5 className="font-medium text-gray-800">Assessment Plan:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                  {syllabus.assessmentPlan.map((assessment, index) => (
                    <li key={index}>{assessment}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-800">
                  Detailed Syllabus:
                </h5>
                <div className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                  {syllabus.syllabus}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusGenerator;
