import React from "react";
import { Course, Enrollment } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface CourseCardProps {
  course: Course;
  enrollment?: Enrollment;
  onEnroll?: (courseId: string) => void;
  onDrop?: (enrollmentId: string) => void;
  onEdit?: (course: Course) => void;
  loading?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  enrollment,
  onEnroll,
  onDrop,
  onEdit,
  loading = false,
}) => {
  const { user } = useAuth();

  const getEnrollmentStatus = () => {
    if (!enrollment) return null;

    const statusConfig = {
      PENDING: {
        icon: Clock,
        text: "Pending",
        color: "text-yellow-600 bg-yellow-50",
      },
      APPROVED: {
        icon: CheckCircle,
        text: "Enrolled",
        color: "text-green-600 bg-green-50",
      },
      REJECTED: {
        icon: XCircle,
        text: "Rejected",
        color: "text-red-600 bg-red-50",
      },
      DROPPED: {
        icon: XCircle,
        text: "Dropped",
        color: "text-gray-600 bg-gray-50",
      },
    };

    const status = statusConfig[enrollment.status];
    const IconComponent = status.icon;

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status.text}
      </div>
    );
  };

  const canEnroll = user?.role === "student" && !enrollment;
  const canDrop = user?.role === "student" && enrollment?.status === "APPROVED";
  const canEdit = user?.role === "lecturer" && course.lecturerId === user.id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {course.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {course.description}
            </p>
          </div>
          {getEnrollmentStatus()}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{course.credits} Credits</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>{course.enrollmentCount || 0} Students</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
          </div>
          {course.syllabus && (
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <a
                href={course.syllabus}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Syllabus
              </a>
            </div>
          )}
        </div>

        {course.lecturer && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Instructor:</span>{" "}
              {course.lecturer.name}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {canEnroll && (
              <button
                onClick={() => onEnroll?.(course.id)}
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Enrolling..." : "Enroll"}
              </button>
            )}

            {canDrop && (
              <button
                onClick={() => onDrop?.(enrollment!.id)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Dropping..." : "Drop Course"}
              </button>
            )}

            {canEdit && (
              <button
                onClick={() => onEdit?.(course)}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Edit Course
              </button>
            )}
          </div>

          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              course.status === "ACTIVE"
                ? "text-green-700 bg-green-100"
                : course.status === "DRAFT"
                  ? "text-yellow-700 bg-yellow-100"
                  : "text-gray-700 bg-gray-100"
            }`}
          >
            {course.status}
          </span>
        </div>
      </div>
    </div>
  );
};
