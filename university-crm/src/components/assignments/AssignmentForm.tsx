import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Send, FileText, X } from "lucide-react";
import { CreateAssignmentData } from "../../types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import toast from "react-hot-toast";

interface AssignmentFormProps {
  courseId: string;
  onSubmit: (data: CreateAssignmentData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  courseId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [submissionType, setSubmissionType] = useState<"text" | "file">("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateAssignmentData>({
    defaultValues: {
      courseId,
      title: "",
      description: "",
      content: "",
      dueDate: "",
    },
  });

  const content = watch("content");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        toast.error("File size must be less than 50MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
        "application/zip",
        "application/x-zip-compressed",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Please upload a supported file type (PDF, DOC, DOCX, TXT, ZIP)"
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const onFormSubmit = async (data: CreateAssignmentData) => {
    try {
      if (submissionType === "file" && !selectedFile) {
        toast.error("Please select a file to upload");
        return;
      }

      if (submissionType === "text" && !data.content?.trim()) {
        toast.error("Please enter your submission content");
        return;
      }

      const submissionData = {
        ...data,
        submissionType,
        file: submissionType === "file" ? selectedFile : undefined,
        content: submissionType === "text" ? data.content : undefined,
      };

      await onSubmit(submissionData);
      reset();
      setSelectedFile(null);
      toast.success("Assignment submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit assignment");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Submit Assignment</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Title *
          </label>
          <input
            {...register("title", {
              required: "Assignment title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Chapter 1 Homework"
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
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of your assignment..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="datetime-local"
            {...register("dueDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Submission Type *
          </label>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setSubmissionType("text")}
              className={`flex items-center px-4 py-2 rounded-md border transition-colors ${
                submissionType === "text"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText size={16} className="mr-2" />
              Text Submission
            </button>
            <button
              type="button"
              onClick={() => setSubmissionType("file")}
              className={`flex items-center px-4 py-2 rounded-md border transition-colors ${
                submissionType === "file"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Upload size={16} className="mr-2" />
              File Upload
            </button>
          </div>

          {submissionType === "text" ? (
            <div>
              <textarea
                {...register("content", {
                  required:
                    submissionType === "text" ? "Content is required" : false,
                  minLength: {
                    value: 10,
                    message: "Content must be at least 10 characters",
                  },
                })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your assignment submission here..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
              <div className="text-sm text-gray-500 mt-2">
                {content?.length || 0} characters
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.zip"
                onChange={handleFileUpload}
                className="hidden"
                id="assignment-file"
              />
              <label
                htmlFor="assignment-file"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-gray-600 text-center">
                  Click to upload your assignment file
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Supported: PDF, DOC, DOCX, TXT, ZIP (Max: 50MB)
                </span>
              </label>
              {selectedFile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
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
            {isLoading ? <LoadingSpinner size="small" /> : <Send size={16} />}
            <span>Submit Assignment</span>
          </button>
        </div>
      </form>
    </div>
  );
};
