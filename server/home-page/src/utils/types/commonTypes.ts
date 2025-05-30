export type UUID = string;

export type PaginationParams = {
  page: number;
  limit: number;
};

export type SortParams = {
  field: string;
  order: 'asc' | 'desc';
};

export type FilterParams = {
  [key: string]: any;
};