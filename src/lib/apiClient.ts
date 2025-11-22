import { useAuthStore } from "@/store/authStore";
    
const getAuthStore = () => {
  return useAuthStore.getState();
};

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken, clearAuth } = getAuthStore();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      try {
        const errorData = await response.clone().json();
        console.error("401 Unauthorized:", errorData);
      } catch { 
      }

      clearAuth();
      
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      
      throw new Error("Unauthorized");
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export const apiGet = (url: string, options?: RequestInit) => {
  return apiRequest(url, { ...options, method: "GET" });
};

export const apiPost = (url: string, data?: unknown, options?: RequestInit) => {
  return apiRequest(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiPut = (url: string, data?: unknown, options?: RequestInit) => {
  return apiRequest(url, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiDelete = (url: string, options?: RequestInit) => {
  return apiRequest(url, { ...options, method: "DELETE" });
};

