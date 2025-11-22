import { useAuthStore } from "@/store/authStore";

// Get the store instance outside of React component
const getAuthStore = () => {
  return useAuthStore.getState();
};

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken, clearAuth } = getAuthStore();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if token exists
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      // Try to parse error response for logging
      try {
        const errorData = await response.clone().json();
        console.error("401 Unauthorized:", errorData);
      } catch {
        // Ignore JSON parse errors
      }

      // Clear auth store
      clearAuth();
      
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      
      // Throw error to prevent further processing
      throw new Error("Unauthorized");
    }

    return response;
  } catch (error) {
    // Re-throw the error so calling code can handle it
    throw error;
  }
}

// Convenience methods
export const apiGet = (url: string, options?: RequestInit) => {
  return apiRequest(url, { ...options, method: "GET" });
};

export const apiPost = (url: string, data?: any, options?: RequestInit) => {
  return apiRequest(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiPut = (url: string, data?: any, options?: RequestInit) => {
  return apiRequest(url, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiDelete = (url: string, options?: RequestInit) => {
  return apiRequest(url, { ...options, method: "DELETE" });
};

