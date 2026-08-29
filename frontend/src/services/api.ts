import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"

import {
  API_BASE_URL,
  STORAGE_KEYS,
} from "@/lib/constants"

import type {
  ApiError,
  ValidationErrorDetail,
} from "@/types/api"

// ============================================================
// AXIOS CLIENT
// ============================================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 300000,
})

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || ""

    // ==========================================================
    // PUBLIC AUTH ENDPOINTS
    // ==========================================================

    const isPublicAuthEndpoint =
      url === "/create_owner" ||
      url === "/login_owner"

    if (isPublicAuthEndpoint) {
      return config
    }

    // ==========================================================
    // OWNER AUTHENTICATED ENDPOINTS
    // ==========================================================

    const isOwnerEndpoint =
      url === "/register" ||
      url === "/login" ||
      url === "/companies" ||
      url.startsWith("/companies/")

    if (isOwnerEndpoint) {
      const ownerToken = localStorage.getItem(
        STORAGE_KEYS.OWNER_TOKEN
      )

      if (ownerToken) {
        config.headers.Authorization = `Bearer ${ownerToken}`
      }

      return config
    }

    // ==========================================================
    // COMPANY AUTHENTICATED ENDPOINTS
    // ==========================================================
    //
    // /research
    // /research/{id}
    // /run
    // etc.
    //
    // These use the COMPANY JWT.
    // ==========================================================

    const companyToken = localStorage.getItem(
      STORAGE_KEYS.COMPANY_TOKEN
    )

    if (companyToken) {
      config.headers.Authorization = `Bearer ${companyToken}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const normalizedError = normalizeError(error)

    return Promise.reject(normalizedError)
  }
)

// ============================================================
// ERROR NORMALIZATION
// ============================================================

function normalizeError(
  error: AxiosError
): ApiError {
  // ==========================================================
  // NO RESPONSE FROM BACKEND
  // ==========================================================

  if (!error.response) {
    return {
      status: 0,
      message:
        "Network error. Please check your connection.",
    }
  }

  const status = error.response.status

  const data =
    error.response.data as Record<string, unknown>

  // ==========================================================
  // FASTAPI VALIDATION ERROR
  // ==========================================================

  if (
    status === 422 &&
    Array.isArray(data.detail)
  ) {
    const details =
      data.detail as ValidationErrorDetail[]

    const firstError = details[0]

    return {
      status,
      message:
        firstError?.msg ||
        "Validation failed",
      details,
    }
  }

  // ==========================================================
  // STANDARD FASTAPI ERROR
  // ==========================================================

  if (
    typeof data.detail === "string"
  ) {
    return {
      status,
      message: data.detail,
    }
  }

  // ==========================================================
  // GENERIC HTTP ERRORS
  // ==========================================================

  const statusMessages: Record<number, string> = {
    400: "Bad request",
    401: "Authentication required. Please log in again.",
    403: "Access denied",
    404: "Resource not found",
    409: "Conflict - resource already exists",
    429: "Too many requests. Please slow down.",
    500: "Server error. Please try again later.",
    503: "Service unavailable",
  }

  return {
    status,
    message:
      statusMessages[status] ||
      `Error ${status}`,
  }
}

export { apiClient }