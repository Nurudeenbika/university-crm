import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Course, Enrollment, ApiResponse, PaginatedResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export const useCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApiResponse<PaginatedResponse<Course>>>(
        "/courses",
        params
      );

      if (response.success) {
        setCourses(response.data.items);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    if (user?.role !== "student") return;

    try {
      const response =
        await api.get<ApiResponse<Enrollment[]>>("/enrollments/my");
      if (response.success) {
        setEnrollments(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    }
  };

  const createCourse = async (courseData: Partial<Course>) => {
    try {
      setLoading(true);
      const response = await api.post<ApiResponse<Course>>(
        "/courses",
        courseData
      );

      if (response.success) {
        setCourses((prev) => [response.data, ...prev]);
        toast.success("Course created successfully");
        return response.data;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create course";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (
    courseId: string,
    courseData: Partial<Course>
  ) => {
    try {
      setLoading(true);
      const response = await api.put<ApiResponse<Course>>(
        `/courses/${courseId}`,
        courseData
      );

      if (response.success) {
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId ? { ...course, ...response.data } : course
          )
        );
        toast.success("Course updated successfully");
        return response.data;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update course";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      setLoading(true);
      const response = await api.post<ApiResponse<Enrollment>>(
        "/courses/enroll",
        { courseId }
      );

      if (response.success) {
        setEnrollments((prev) => [response.data, ...prev]);
        toast.success("Enrollment request submitted");
        return response.data;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to enroll in course";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const dropCourse = async (enrollmentId: string) => {
    try {
      setLoading(true);
      await api.delete(`/enrollments/${enrollmentId}`);

      setEnrollments((prev) =>
        prev.filter((enrollment) => enrollment.id !== enrollmentId)
      );
      toast.success("Successfully dropped course");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to drop course";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadSyllabus = async (courseId: string, file: File) => {
    try {
      setLoading(true);
      const response = await api.uploadFile<ApiResponse<{ url: string }>>(
        `/courses/${courseId}/syllabus`,
        file
      );

      if (response.success) {
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? { ...course, syllabus: response.data.url }
              : course
          )
        );
        toast.success("Syllabus uploaded successfully");
        return response.data.url;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload syllabus";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMyEnrollments();
  }, [user]);

  return {
    courses,
    enrollments,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    enrollInCourse,
    dropCourse,
    uploadSyllabus,
    refetch: () => {
      fetchCourses();
      fetchMyEnrollments();
    },
  };
};
