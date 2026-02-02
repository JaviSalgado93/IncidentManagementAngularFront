export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: any;
  validationErrors?: Record<string, string[]>;
}
