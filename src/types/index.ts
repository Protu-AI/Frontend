// API Response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Add more types as needed