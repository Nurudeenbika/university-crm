import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Bell,
  ChevronRight,
  BarChart3,
  PieChart,
  User,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  Plus,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
  subtitle?: string;
};

// Mock data for demonstration
const mockUser = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@university.edu",
  role: "student", // Change to "lecturer" or "admin" to see different views
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
};

const mockCourses = [
  {
    id: 1,
    title: "Advanced Computer Science",
    code: "CS401",
    credits: 4,
    instructor: "Dr. Smith",
    enrolledStudents: 45,
    progress: 75,
    nextClass: "2025-07-02T10:00:00Z",
    grade: 85,
  },
  {
    id: 2,
    title: "Database Systems",
    code: "CS350",
    credits: 3,
    instructor: "Prof. Johnson",
    enrolledStudents: 38,
    progress: 60,
    nextClass: "2025-07-01T14:00:00Z",
    grade: 92,
  },
  {
    id: 3,
    title: "Machine Learning",
    code: "CS480",
    credits: 4,
    instructor: "Dr. Williams",
    enrolledStudents: 52,
    progress: 40,
    nextClass: "2025-07-03T09:00:00Z",
    grade: 78,
  },
];

const mockAssignments = [
  {
    id: 1,
    title: "Final Project Proposal",
    course: "CS401",
    dueDate: "2025-07-05T23:59:00Z",
    status: "pending",
    grade: null,
    type: "project",
  },
  {
    id: 2,
    title: "Database Design Assignment",
    course: "CS350",
    dueDate: "2025-07-03T23:59:00Z",
    status: "submitted",
    grade: 88,
    type: "assignment",
  },
  {
    id: 3,
    title: "ML Algorithm Implementation",
    course: "CS480",
    dueDate: "2025-07-08T23:59:00Z",
    status: "draft",
    grade: null,
    type: "coding",
  },
];

const DashboardPage = () => {
  const [user] = useState(mockUser);
  const [courses] = useState(mockCourses);
  const [assignments] = useState(mockAssignments);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    subtitle,
  }: StatCardProps) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600">
            {course.code} • {course.credits} Credits
          </p>
          <p className="text-sm text-gray-500">Prof. {course.instructor}</p>
        </div>
        {user.role === "student" && course.grade && (
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {course.grade}%
            </span>
          </div>
        )}
      </div>

      {user.role === "student" && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{course.enrolledStudents} students</span>
        </div>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
          View Course
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );

  type Assignment = {
    id: number;
    title: string;
    course: string;
    dueDate: string;
    status: string;
    grade: number | null;
    type: string;
  };

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
    const getDueDateColor = () => {
      const dueDate = new Date(assignment.dueDate);
      const now = new Date();
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff < 0) return "text-red-600";
      if (daysDiff <= 2) return "text-orange-600";
      return "text-gray-600";
    };

    const getStatusIcon = () => {
      switch (assignment.status) {
        case "submitted":
          return <CheckCircle className="h-4 w-4 text-green-600" />;
        case "pending":
          return <Clock className="h-4 w-4 text-orange-600" />;
        default:
          return <AlertCircle className="h-4 w-4 text-gray-400" />;
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
            <p className="text-sm text-gray-600">{assignment.course}</p>
            <p className={`text-sm ${getDueDateColor()}`}>
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {assignment.grade && (
              <span className="text-sm font-medium text-green-600">
                {assignment.grade}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const UpcomingClass = ({ course }) => (
    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
      <div className="flex-shrink-0">
        <Calendar className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{course.title}</p>
        <p className="text-xs text-gray-600">
          {new Date(course.nextClass).toLocaleString()}
        </p>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Courses"
          value={courses.length}
          icon={BookOpen}
          color="bg-blue-600"
          trend="+2 this semester"
        />
        <StatCard
          title="Pending Assignments"
          value={assignments.filter((a) => !a.grade).length}
          icon={FileText}
          color="bg-orange-500"
        />
        <StatCard
          title="Average Grade"
          value={`${Math.round(courses.reduce((sum, c) => sum + c.grade, 0) / courses.length)}%`}
          icon={Award}
          color="bg-green-600"
          trend="+5.2%"
        />
        <StatCard
          title="Credits Earned"
          value={courses.reduce((sum, c) => sum + c.credits, 0)}
          icon={GraduationCap}
          color="bg-purple-600"
          subtitle="out of 120 total"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                My Courses
              </h2>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Classes
            </h3>
            <div className="space-y-3">
              {courses.slice(0, 3).map((course) => (
                <UpcomingClass key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* Recent Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Assignments
            </h3>
            <div className="space-y-3">
              {assignments.slice(0, 4).map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5" />
                  <span>Submit Assignment</span>
                </div>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5" />
                  <span>Download Transcript</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLecturerDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Courses"
          value={courses.length}
          icon={BookOpen}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Students"
          value={courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
          icon={Users}
          color="bg-green-600"
        />
        <StatCard
          title="Assignments to Grade"
          value={
            assignments.filter((a) => !a.grade && a.status === "submitted")
              .length
          }
          icon={FileText}
          color="bg-orange-500"
        />
        <StatCard
          title="Average Class Grade"
          value="82.5%"
          icon={BarChart3}
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            My Courses
          </h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Assignments to Grade
          </h2>
          <div className="space-y-3">
            {assignments
              .filter((a) => a.status === "submitted")
              .map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value="142"
          icon={BookOpen}
          color="bg-blue-600"
          trend="+12 this month"
        />
        <StatCard
          title="Total Students"
          value="2,847"
          icon={Users}
          color="bg-green-600"
          trend="+156 this month"
        />
        <StatCard
          title="Pending Enrollments"
          value="28"
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="System Average"
          value="78.4%"
          icon={TrendingUp}
          color="bg-purple-600"
          trend="+2.1%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    5 new course enrollments
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    12 assignments submitted
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">3 pending approvals</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                Top Performing Courses
              </h3>
              <div className="space-y-2">
                {courses.slice(0, 3).map((course, index) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {index + 1}. {course.code}
                    </span>
                    <span className="font-medium text-gray-900">
                      {course.grade}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-3 text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5" />
                  <span>Add New Course</span>
                </div>
              </button>
              <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 rounded-lg p-3 text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5" />
                  <span>Manage Users</span>
                </div>
              </button>
              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg p-3 text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5" />
                  <span>View Reports</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.firstName}
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-gray-600">
                  {user.role === "student" &&
                    "Ready to continue your learning journey?"}
                  {user.role === "lecturer" &&
                    "Let's make education impactful today."}
                  {user.role === "admin" &&
                    "System management at your fingertips."}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.role === "student"
                      ? "bg-blue-500"
                      : user.role === "lecturer"
                        ? "bg-green-500"
                        : "bg-purple-500"
                  }`}
                ></div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {user.role === "student" && renderStudentDashboard()}
        {user.role === "lecturer" && renderLecturerDashboard()}
        {user.role === "admin" && renderAdminDashboard()}
      </div>
    </div>
  );
};

export default DashboardPage;
