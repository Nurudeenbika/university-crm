import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Define response types
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config: { headers: { Authorization: string } }) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Clear auth data and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";

          // Show error message if available
          const errorMessage =
            error.response.data?.message ||
            "Session expired. Please login again.";
          this.showError(errorMessage);
        } else if (error.response?.status === 403) {
          this.showError("You do not have permission to perform this action.");
        } else if (error.response?.status === 404) {
          this.showError("The requested resource was not found.");
        } else if (error.response?.status >= 500) {
          this.showError("Server error. Please try again later.");
        } else if (error.code === "ECONNABORTED") {
          this.showError("Request timeout. Please check your connection.");
        } else if (!error.response) {
          this.showError(
            "Network error. Please check your internet connection."
          );
        }

        return Promise.reject(error);
      }
    );
  }

  private showError(message: string): void {
    // Simple error display - replace with your preferred toast/notification system
    console.error("API Error:", message);

    // You can integrate with toast libraries like react-hot-toast or react-toastify
    // toast.error(message);

    // Or dispatch to a global error state
    // dispatch(showErrorMessage(message));
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, { params });
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data);
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data);
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.patch<ApiResponse<T>>(url, data);
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url);
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload with progress tracking
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, any>
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Add additional form data if provided
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await this.api.post<ApiResponse<T>>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: {
          total: number;
          loaded: number;
        }) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });

      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Multiple file upload
  async uploadMultipleFiles<T>(
    url: string,
    files: File[],
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, any>
  ): Promise<T> {
    try {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append(`files`, file);
      });

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await this.api.post<ApiResponse<T>>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: {
          total: number;
          loaded: number;
        }) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });

      return response.data.data || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Download file
  async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || `download_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle and format errors
  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error("An unexpected error occurred");
    }
  }

  // Auth token management
  setAuthToken(token: string): void {
    localStorage.setItem("token", token);
  }

  removeAuthToken(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Get base URL for manual requests
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export singleton instance
export const api = new ApiService();
export default api;
