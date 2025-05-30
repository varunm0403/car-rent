export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
};

export type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: {
    content: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};