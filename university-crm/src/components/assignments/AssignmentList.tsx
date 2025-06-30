// /frontend/src/components/assignments/AssignmentList.tsx
import React, { useState } from "react";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react";
import { Assignment, UserRole } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface AssignmentListProps {
  assignments: Assignment[];
  isLoading?: boolean;
  onGrade?: (assignmentId: string, grade: number) => void;
  onDownload?: (assignmentId: string) => void;
  onView?: (assignmentId: string) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  isLoading = false,
  onGrade,
  onDownload,
  onView,
}) => {
  const { user } = useAuth();
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(
    null
  );

  const getStatusIcon = (assignment: Assignment) => {
    if (assignment.grade !== null && assignment.grade !== undefined) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }

    if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }

    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = (assignment: Assignment) => {
    if (assignment.grade !== null && assignment.grade !== undefined) {
      return `Graded (${assignment.grade}/100)`;
    }

    if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
      return "Overdue";
    }

    return "Pending";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 bg-green-100";
    if (grade >= 80) return "text-blue-600 bg-blue-100";
    if (grade >= 70) return "text-yellow-600 bg-yellow-100";
    if (grade >= 60) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium">No assignments found</p>
        <p className="text-sm">
          {user?.role === "student"
            ? "No assignments have been submitted yet."
            : "No assignments have been created for this course yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assignment.title}
                  </h3>
                  {getStatusIcon(assignment)}
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">
                  {assignment.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  {assignment.dueDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    <span>Status: {getStatusText(assignment)}</span>
                  </div>

                  {assignment.submittedAt && (
                    <div className="flex items-center space-x-1">
                      <span>
                        Submitted: {formatDate(assignment.submittedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {assignment.grade !== null &&
                  assignment.grade !== undefined && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(assignment.grade)}`}
                    >
                      {assignment.grade}/100
                    </span>
                  )}

                <div className="flex space-x-2">
                  {onView && (
                    <button
                      onClick={() => onView(assignment.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="View assignment"
                    >
                      <Eye size={16} />
                    </button>
                  )}

                  {assignment.file && onDownload && (
                    <button
                      onClick={() => onDownload(assignment.id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      title="Download file"
                    >
                      <Download size={16} />
                    </button>
                  )}

                  {user?.role === "lecturer" &&
                    onGrade &&
                    assignment.grade === null && (
                      <button
                        onClick={() =>
                          setExpandedAssignment(
                            expandedAssignment === assignment.id
                              ? null
                              : assignment.id
                          )
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Grade
                      </button>
                    )}
                </div>
              </div>
            </div>

            {/* Expanded grading section for lecturers */}
            {expandedAssignment === assignment.id &&
              user?.role === "lecturer" &&
              onGrade && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <GradeForm
                    assignmentId={assignment.id}
                    onSubmit={(grade) => {
                      onGrade(assignment.id, grade);
                      setExpandedAssignment(null);
                    }}
                    onCancel={() => setExpandedAssignment(null)}
                  />
                </div>
              )}

            {/* Assignment content preview */}
            {expandedAssignment === assignment.id && assignment.content && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Submission Content:
                </h4>
                <div className="bg-gray-50 rounded-md p-3 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {assignment.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Quick inline grading component
interface GradeFormProps {
  assignmentId: string;
  onSubmit: (grade: number) => void;
  onCancel: () => void;
}

const GradeForm: React.FC<GradeFormProps> = ({
  assignmentId,
  onSubmit,
  onCancel,
}) => {
  const [grade, setGrade] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericGrade = parseInt(grade);
    if (numericGrade >= 0 && numericGrade <= 100) {
      onSubmit(numericGrade);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter grade"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feedback (Optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Provide feedback for the student..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Grade
        </button>
      </div>
    </form>
  );
};
