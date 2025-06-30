import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, X, Star } from "lucide-react";
import { Assignment, GradeData } from "../../types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import toast from "react-hot-toast";

interface GradeFormProps {
  assignment: Assignment;
  onSubmit: (data: GradeData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const GradeForm: React.FC<GradeFormProps> = ({
  assignment,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(
    assignment.grade || 0
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<GradeData>({
    defaultValues: {
      assignmentId: assignment.id,
      grade: assignment.grade || 0,
      feedback: assignment.feedback || "",
      rubricScores: {},
    },
  });

  const feedback = watch("feedback");
  const currentGrade = watch("grade");

  const gradeRanges = [
    {
      min: 90,
      max: 100,
      label: "Excellent (A)",
      color: "bg-green-500",
      textColor: "text-green-700",
    },
    {
      min: 80,
      max: 89,
      label: "Good (B)",
      color: "bg-blue-500",
      textColor: "text-blue-700",
    },
    {
      min: 70,
      max: 79,
      label: "Satisfactory (C)",
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
    },
    {
      min: 60,
      max: 69,
      label: "Needs Improvement (D)",
      color: "bg-orange-500",
      textColor: "text-orange-700",
    },
    {
      min: 0,
      max: 59,
      label: "Unsatisfactory (F)",
      color: "bg-red-500",
      textColor: "text-red-700",
    },
  ];

  const getCurrentGradeRange = (grade: number) => {
    return gradeRanges.find(
      (range) => grade >= range.min && grade <= range.max
    );
  };

  const quickGrades = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 0];

  const handleQuickGrade = (grade: number) => {
    setSelectedGrade(grade);
    setValue("grade", grade);
  };

  const onFormSubmit = async (data: GradeData) => {
    try {
      if (data.grade < 0 || data.grade > 100) {
        toast.error("Grade must be between 0 and 100");
        return;
      }

      await onSubmit(data);
      toast.success("Grade submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit grade");
    }
  };

  const currentRange = getCurrentGradeRange(currentGrade);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grade Assignment</h2>
          <p className="text-gray-600 mt-1">{assignment.title}</p>
          <p className="text-sm text-gray-500">
            Student: {assignment.studentName} • Submitted:{" "}
            {new Date(assignment.submittedAt || "").toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {/* Assignment Content Preview */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Submission Content:</h3>
        {assignment.content ? (
          <div className="bg-white p-3 rounded border max-h-48 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {assignment.content}
            </p>
          </div>
        ) : assignment.file ? (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>
              File submission: {assignment.fileName || "Attached file"}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No content available</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Grade Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade (0-100) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                {...register("grade", {
                  required: "Grade is required",
                  min: { value: 0, message: "Grade cannot be less than 0" },
                  max: { value: 100, message: "Grade cannot be more than 100" },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                placeholder="Enter grade"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">/100</span>
              </div>
            </div>
            {errors.grade && (
              <p className="text-red-500 text-sm mt-1">
                {errors.grade.message}
              </p>
            )}

            {/* Grade Range Indicator */}
            {currentRange && (
              <div
                className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${currentRange.textColor} bg-opacity-20`}
                style={{
                  backgroundColor: currentRange.color
                    .replace("bg-", "")
                    .replace("-500", ""),
                }}
              >
                {currentRange.label}
              </div>
            )}
          </div>

          {/* Quick Grade Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Grade Selection
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickGrades.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleQuickGrade(grade)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    currentGrade === grade
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback for Student
          </label>
          <textarea
            {...register("feedback")}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide detailed feedback on the student's work..."
          />
          <div className="text-sm text-gray-500 mt-1">
            {feedback?.length || 0} characters
          </div>
        </div>

        {/* Rubric Scoring (Optional) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Rubric Scoring (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "content", label: "Content Quality", maxPoints: 25 },
              { key: "organization", label: "Organization", maxPoints: 25 },
              {
                key: "analysis",
                label: "Analysis & Critical Thinking",
                maxPoints: 25,
              },
              {
                key: "presentation",
                label: "Presentation & Format",
                maxPoints: 25,
              },
            ].map((criterion) => (
              <div key={criterion.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {criterion.label} (/{criterion.maxPoints})
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={criterion.maxPoints}
                    step="0.5"
                    {...register(`rubricScores.${criterion.key}`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className="text-gray-300 hover:text-yellow-400 cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? <LoadingSpinner size="small" /> : <Save size={16} />}
            <span>Submit Grade</span>
          </button>
        </div>
      </form>
    </div>
  );
};
