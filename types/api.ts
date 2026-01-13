/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
  message?: string;
  code?: string;
  details?: unknown;
}

/**
 * Success response structure
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Next.js route handler context (for dynamic routes)
 */
export interface RouteHandlerContext {
  params: Promise<{ [key: string]: string | string[] }>;
}

/**
 * NextAuth route handler context
 */
export interface NextAuthRouteContext {
  params: Promise<{ nextauth: string[] }>;
}
