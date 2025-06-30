export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
  lecturerId: string;
  lecturer?: User;
  syllabus?: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  enrollmentCount?: number;
  enrolledStudents?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DROPPED";
  enrolledAt: string;
  course?: Course;
  student?: User;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  studentId: string;
  file?: string;
  content?: string;
  grade?: number;
  maxGrade: number;
  weight: number;
  submittedAt?: string;
  gradedAt?: string;
  course?: Course;
  student?: User;
}

export interface AIRecommendation {
  courseId: string;
  course: Course;
  score: number;
  reason: string;
}

export interface SyllabusGeneration {
  topic: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: number;
  content: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "lecturer" | "admin";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
