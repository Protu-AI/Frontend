import { APP_CONFIG } from '@/config/constants';
import { ApiError, ApiResponse } from '@/types/api';

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = APP_CONFIG.API.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.message, response.status, error);
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
      message: response.statusText,
    };
  }

  private createAbortController(timeout: number): { controller: AbortController; timeoutId: NodeJS.Timeout } {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutId };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout: number = APP_CONFIG.API.TIMEOUT
  ): Promise<ApiResponse<T>> {
    const { controller, timeoutId } = this.createAbortController(timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        500
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        Authorization: `Bearer ${token}`,
      };
    } else {
      delete this.defaultHeaders.Authorization;
    }
  }
}

export const apiClient = new ApiClient();