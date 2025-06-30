import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Save, X } from "lucide-react";
import { Course, CreateCourseData } from "../../types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import toast from "react-hot-toast";

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CreateCourseData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  course,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [syllabusPreview, setSyllabusPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCourseData>({
    defaultValues: course || {
      title: "",
      description: "",
      credits: 3,
      code: "",
      semester: "",
      year: new Date().getFullYear(),
    },
  });

  const handleSyllabusUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }

      setSyllabusFile(file);
      setSyllabusPreview(file.name);
    }
  };

  const onFormSubmit = async (data: CreateCourseData) => {
    try {
      const formData = {
        ...data,
        syllabus: syllabusFile,
      };
      await onSubmit(formData);
      reset();
      setSyllabusFile(null);
      setSyllabusPreview("");
      toast.success(
        course ? "Course updated successfully!" : "Course created successfully!"
      );
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {course ? "Edit Course" : "Create New Course"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Code *
            </label>
            <input
              {...register("code", {
                required: "Course code is required",
                pattern: {
                  value: /^[A-Z]{2,4}\d{3,4}$/,
                  message: "Invalid course code format (e.g., CS101)",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., CS101"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credits *
            </label>
            <select
              {...register("credits", {
                required: "Credits are required",
                min: { value: 1, message: "Credits must be at least 1" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map((credit) => (
                <option key={credit} value={credit}>
                  {credit}
                </option>
              ))}
            </select>
            {errors.credits && (
              <p className="text-red-500 text-sm mt-1">
                {errors.credits.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            {...register("title", {
              required: "Course title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Introduction to Computer Science"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Course description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester *
            </label>
            <select
              {...register("semester", { required: "Semester is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Semester</option>
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
            {errors.semester && (
              <p className="text-red-500 text-sm mt-1">
                {errors.semester.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              type="number"
              {...register("year", {
                required: "Year is required",
                min: { value: 2020, message: "Year must be 2020 or later" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Syllabus Upload
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleSyllabusUpload}
              className="hidden"
              id="syllabus-upload"
            />
            <label
              htmlFor="syllabus-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-gray-600">
                Click to upload syllabus (PDF, DOC, DOCX)
              </span>
              <span className="text-sm text-gray-500 mt-1">
                Max file size: 10MB
              </span>
            </label>
            {syllabusPreview && (
              <div className="mt-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
                <span className="text-sm text-blue-800">{syllabusPreview}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSyllabusFile(null);
                    setSyllabusPreview("");
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? <LoadingSpinner size="small" /> : <Save size={16} />}
            <span>{course ? "Update Course" : "Create Course"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
