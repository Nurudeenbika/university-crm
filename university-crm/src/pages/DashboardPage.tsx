//frontend/pages/DashboardPage
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "../components/common/Layout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { CourseList } from "../components/courses/CourseList";
import { AssignmentList } from "../components/assignments/AssignmentList";
import { api } from "../services/api";
import { Course, Assignment } from "../types";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingEnrollments: 0,
    averageGrade: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        if (user?.role === "student") {
          const [coursesResponse, assignmentsResponse] = await Promise.all([
            api.get("/courses/enrolled"),
            api.get("/assignments/my-assignments"),
          ]);
          setCourses((coursesResponse as { data: Course[] }).data);
          setAssignments((assignmentsResponse as { data: Assignment[] }).data);
        } else if (user?.role === "lecturer") {
          const [coursesResponse, assignmentsResponse] = await Promise.all([
            api.get("/courses/my-courses"),
            api.get("/assignments/to-grade"),
          ]);
          setCourses((coursesResponse as { data: Course[] }).data);
          setAssignments((assignmentsResponse as { data: Assignment[] }).data);
        } else if (user?.role === "admin") {
          const [coursesResponse, statsResponse] = await Promise.all([
            api.get("/courses"),
            api.get("/admin/stats"),
          ]);
          setCourses((coursesResponse as { data: Course[] }).data);
          setStats((statsResponse as { data: typeof stats }).data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Enrolled Courses
          </h3>
          <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Pending Assignments
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {assignments.filter((a) => !a.grade).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Average Grade</h3>
          <p className="text-3xl font-bold text-green-600">
            {assignments.length > 0
              ? (
                  assignments.reduce((sum, a) => sum + (a.grade || 0), 0) /
                  assignments.length
                ).toFixed(1)
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">My Courses</h3>
          <CourseList courses={courses} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Assignments</h3>
          <AssignmentList assignments={assignments.slice(0, 5)} />
        </div>
      </div>
    </div>
  );

  const renderLecturerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">My Courses</h3>
          <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Assignments to Grade
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {assignments.filter((a) => !a.grade).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Total Students
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {courses.reduce(
              (sum, course) => sum + (course.enrolledStudents || 0),
              0
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">My Courses</h3>
          <CourseList courses={courses} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Assignments to Grade</h3>
          <AssignmentList assignments={assignments.slice(0, 5)} />
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalCourses}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Total Students
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalStudents}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Pending Enrollments
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.pendingEnrollments}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Average Grade</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.averageGrade.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">All Courses</h3>
        <CourseList courses={courses} />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || user?.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === "student" &&
              "Here's your academic progress overview."}
            {user?.role === "lecturer" &&
              "Manage your courses and grade assignments."}
            {user?.role === "admin" &&
              "System overview and management dashboard."}
          </p>
        </div>

        {user?.role === "student" && renderStudentDashboard()}
        {user?.role === "lecturer" && renderLecturerDashboard()}
        {user?.role === "admin" && renderAdminDashboard()}
      </div>
    </Layout>
  );
};

export default DashboardPage;
