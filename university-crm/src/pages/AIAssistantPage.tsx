// /frontend/src/pages/AIAssistantPage.tsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { USER_ROLES } from "../utils/constants";
import CourseRecommendations from "../components/ai/CourseRecommendations";
import SyllabusGenerator from "../components/ai/SyllabusGenerator";
import {
  Brain,
  BookOpen,
  FileText,
  Sparkles,
  Target,
  Lightbulb,
  MessageSquare,
  Zap,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  isActive,
  onClick,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-6 rounded-lg border-2 transition-all text-left w-full ${
      isActive
        ? "border-indigo-500 bg-indigo-50"
        : disabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
          : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-25"
    }`}
  >
    <div className="flex items-start space-x-4">
      <div
        className={`p-2 rounded-lg ${
          isActive ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3
          className={`font-medium ${isActive ? "text-indigo-900" : "text-gray-900"}`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mt-1 ${isActive ? "text-indigo-700" : "text-gray-600"}`}
        >
          {description}
        </p>
        {disabled && (
          <p className="text-xs text-red-500 mt-2">
            Available for{" "}
            {title.includes("Recommendation")
              ? "students"
              : "lecturers and admins"}{" "}
            only
          </p>
        )}
      </div>
    </div>
  </button>
);

const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [activeFeature, setActiveFeature] = useState<
    "recommendations" | "syllabus" | null
  >(null);

  const features = [
    {
      id: "recommendations" as const,
      icon: <Target className="h-6 w-6" />,
      title: "Course Recommendations",
      description:
        "Get personalized course suggestions based on your interests and academic history.",
      allowedRoles: [USER_ROLES.student],
    },
    {
      id: "syllabus" as const,
      icon: <FileText className="h-6 w-6" />,
      title: "Syllabus Generator",
      description:
        "Automatically generate comprehensive course syllabi from topics and learning objectives.",
      allowedRoles: [USER_ROLES.lecturer, USER_ROLES.admin],
    },
  ];

  const isFeatureAllowed = (feature: (typeof features)[0]) => {
    return feature.allowedRoles.includes(user?.role as any);
  };

  const stats = [
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "AI Recommendations Generated",
      value: "1,247",
      change: "+12%",
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      title: "Syllabi Created",
      value: "89",
      change: "+24%",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Time Saved",
      value: "156h",
      change: "+18%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Leverage artificial intelligence to enhance your educational
          experience with personalized recommendations and automated content
          generation.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stat.change} this month
                </p>
              </div>
              <div className="p-3 rounded-full bg-gray-50">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          AI Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isActive={activeFeature === feature.id}
              onClick={() => setActiveFeature(feature.id)}
              disabled={!isFeatureAllowed(feature)}
            />
          ))}
        </div>
      </div>

      {/* Active Feature Content */}
      {activeFeature && (
        <div className="bg-white rounded-lg shadow-sm border">
          {activeFeature === "recommendations" &&
            user?.role === USER_ROLES.student && <CourseRecommendations />}
          {activeFeature === "syllabus" &&
            (user?.role === USER_ROLES.lecturer ||
              user?.role === USER_ROLES.admin) && <SyllabusGenerator />}
        </div>
      )}

      {/* Getting Started Guide */}
      {!activeFeature && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Getting Started
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>• Select an AI feature above to begin</p>
                {user?.role === USER_ROLES.student && (
                  <p>
                    • Course Recommendations: Input your interests to get
                    personalized course suggestions
                  </p>
                )}
                {(user?.role === USER_ROLES.lecturer ||
                  user?.role === USER_ROLES.admin) && (
                  <p>
                    • Syllabus Generator: Provide course topics to automatically
                    generate detailed syllabi
                  </p>
                )}
                <p>
                  • All AI features are powered by advanced language models for
                  accurate results
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Tips */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
          AI Tips for Better Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="space-y-2">
            <p>
              • <strong>Be specific:</strong> Provide detailed input for more
              accurate results
            </p>
            <p>
              • <strong>Use keywords:</strong> Include relevant academic terms
              and subjects
            </p>
          </div>
          <div className="space-y-2">
            <p>
              • <strong>Review output:</strong> Always review and customize
              AI-generated content
            </p>
            <p>
              • <strong>Iterate:</strong> Try different inputs to explore
              various options
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
