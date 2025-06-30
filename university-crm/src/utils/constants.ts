// /frontend/src/utils/constants.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
export const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL || "http://localhost:3001";

export const USER_ROLES = {
  student: "student",
  lecturer: "lecturer",
  admin: "admin",
} as const;

export const ENROLLMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  DROPPED: "dropped",
} as const;

export const ASSIGNMENT_STATUS = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  GRADED: "graded",
} as const;

export const COURSE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  REFRESH: "/auth/refresh",

  // Courses
  COURSES: "/courses",
  COURSE_ENROLL: "/courses/enroll",
  COURSE_DROP: "/courses/drop",
  MY_COURSES: "/courses/my-courses",

  // Assignments
  ASSIGNMENTS: "/assignments",
  ASSIGNMENT_SUBMIT: "/assignments/submit",
  ASSIGNMENT_GRADE: "/assignments/grade",

  // AI
  AI_RECOMMEND: "/ai/recommend",
  AI_SYLLABUS: "/ai/syllabus",

  // Admin
  USERS: "/admin/users",
  ENROLLMENTS: "/admin/enrollments",
} as const;

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
  ],
  ALLOWED_EXTENSIONS: [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png",
  ],
} as const;

export const GRADE_SCALE = {
  MIN: 0,
  MAX: 100,
  PASS_THRESHOLD: 60,
} as const;

export const NOTIFICATION_TYPES = {
  ENROLLMENT_APPROVED: "enrollment_approved",
  ENROLLMENT_REJECTED: "enrollment_rejected",
  ASSIGNMENT_GRADED: "assignment_graded",
  COURSE_UPDATED: "course_updated",
  SYSTEM_ANNOUNCEMENT: "system_announcement",
} as const;
