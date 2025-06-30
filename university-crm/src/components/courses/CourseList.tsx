import React, { useState } from "react";
import { Course, Enrollment } from "../../types";
import { CourseCard } from "./CourseCard";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Search, Filter, Plus, BookOpen } from "lucide-react";

interface CourseListProps {
  courses: Course[];
  enrollments?: Enrollment[];
  loading?: boolean;
  onEnroll?: (courseId: string) => void;
  onDrop?: (enrollmentId: string) => void;
  onEdit?: (course: Course) => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  enrollments = [],
  loading = false,
  onEnroll,
  onDrop,
  onEdit,
  onCreateNew,
  showCreateButton = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || course.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getEnrollmentForCourse = (courseId: string) => {
    return enrollments.find((enrollment) => enrollment.courseId === courseId);
  };

  if (loading && courses.length === 0) {
    return <LoadingSpinner size="lg" text="Loading courses..." />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {showCreateButton && (
            <button
              onClick={onCreateNew}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </button>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== "ALL"
              ? "No courses found"
              : "No courses available"}
          </h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search or filter criteria."
              : "Check back later for new courses."}
          </p>
          {showCreateButton && !searchTerm && statusFilter === "ALL" && (
            <button
              onClick={onCreateNew}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Course
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enrollment = getEnrollmentForCourse(course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                enrollment={enrollment}
                onEnroll={onEnroll}
                onDrop={onDrop}
                onEdit={onEdit}
              />
            );
          })}
        </div>
      )}

      {/* Loading indicator for additional courses */}
      {loading && courses.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" text="Loading more courses..." />
        </div>
      )}
    </div>
  );
};

export default CourseList;
