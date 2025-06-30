import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { toast } from "react-hot-toast";

interface UseAPIOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  autoFetch?: boolean;
}

export function useAPI<T>(url: string, options: UseAPIOptions<T> = {}) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.get<T>(url, params);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An error occurred");
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const mutate = async (method: "POST" | "PUT" | "DELETE", data?: any) => {
    try {
      setLoading(true);
      setError(null);
      let result;

      switch (method) {
        case "POST":
          result = await api.post<T>(url, data);
          break;
        case "PUT":
          result = await api.put<T>(url, data);
          break;
        case "DELETE":
          result = await api.delete<T>(url);
          break;
      }

      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An error occurred");
      setError(error);
      options.onError?.(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    mutate,
  };
}
