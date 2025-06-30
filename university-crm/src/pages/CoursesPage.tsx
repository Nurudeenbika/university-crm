// /frontend/src/pages/CoursesPage.tsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCourses } from "../hooks/useCourses";
import { USER_ROLES } from "../utils/constants";
import CourseList from "../components/courses/CourseList";
import CourseForm from "../components/courses/CourseForm";
import EnrollmentStatus from "../components/courses/EnrollmentStatus";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Users,
  Calendar,
  ChevronDown,
} from "lucide-react";

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading, error, refetch } = useCourses();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const handleCreateCourse = () => {
    setShowCreateForm(true);
  };

  const handleCourseCreated = () => {
    setShowCreateForm(false);
    refetch();
  };

  const filteredCourses =
    courses?.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || course.status === filterStatus;

      return matchesSearch && matchesFilter;
    }) || [];

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "credits":
        return b.credits - a.credits;
      case "students":
        return (b.enrolledStudents || 0) - (a.enrolledStudents || 0);
      case "created":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Failed to load courses</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
        <button onClick={refetch} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === USER_ROLES.student
              ? "Browse Courses"
              : user?.role === USER_ROLES.lecturer
                ? "My Courses"
                : "All Courses"}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === USER_ROLES.student
              ? "Discover and enroll in courses"
              : user?.role === USER_ROLES.lecturer
                ? "Manage your teaching courses"
                : "Oversee all university courses"}
          </p>
        </div>

        {(user?.role === USER_ROLES.lecturer ||
          user?.role === USER_ROLES.admin) && (
          <button
            onClick={handleCreateCourse}
            className="btn-primary mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {user?.role === USER_ROLES.student
                  ? "Enrolled"
                  : "Total Students"}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.role === USER_ROLES.student
                  ? courses?.filter((c) => c.isEnrolled).length || 0
                  : courses?.reduce(
                      (sum, c) => sum + (c.enrolledStudents || 0),
                      0
                    ) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active This Semester
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {courses?.filter((c) => c.status === "published").length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input pr-8 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input pr-8 appearance-none cursor-pointer"
              >
                <option value="title">Sort by Title</option>
                <option value="credits">Sort by Credits</option>
                <option value="students">Sort by Students</option>
                <option value="created">Sort by Date</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Course List */}
      {sortedCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "No courses are available at the moment"}
          </p>
          {(user?.role === USER_ROLES.lecturer ||
            user?.role === USER_ROLES.admin) && (
            <button onClick={handleCreateCourse} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Course
            </button>
          )}
        </div>
      ) : (
        <CourseList courses={sortedCourses} />
      )}

      {/* Enrollment Status for Students */}
      {user?.role === USER_ROLES.student && <EnrollmentStatus />}

      {/* Create Course Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Create New Course
              </h3>
            </div>
            <div className="p-6">
              <CourseForm
                onSuccess={handleCourseCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
