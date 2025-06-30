// /frontend/src/utils/helpers.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FILE_UPLOAD_LIMITS, GRADE_SCALE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const validateFileUpload = (
  file: File
): { isValid: boolean; error?: string } => {
  if (file.size > FILE_UPLOAD_LIMITS.MAX_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${formatFileSize(FILE_UPLOAD_LIMITS.MAX_SIZE)} limit`,
    };
  }

  if (
    !FILE_UPLOAD_LIMITS.ALLOWED_TYPES.includes(
      file.type as (typeof FILE_UPLOAD_LIMITS.ALLOWED_TYPES)[number]
    )
  ) {
    return {
      isValid: false,
      error: `File type not allowed. Supported types: ${FILE_UPLOAD_LIMITS.ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  return { isValid: true };
};

export const calculateGPA = (grades: number[]): number => {
  if (grades.length === 0) return 0;

  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return Number((sum / grades.length).toFixed(2));
};

export const getGradeColor = (grade: number): string => {
  if (grade >= 90) return "text-green-600";
  if (grade >= 80) return "text-blue-600";
  if (grade >= 70) return "text-yellow-600";
  if (grade >= GRADE_SCALE.PASS_THRESHOLD) return "text-orange-600";
  return "text-red-600";
};

export const getGradeLetter = (grade: number): string => {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= GRADE_SCALE.PASS_THRESHOLD) return "D";
  return "F";
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateAvatarUrl = (name: string): string => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return `https://ui-avatars.com/api/?name=${initials}&background=random&size=40`;
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
