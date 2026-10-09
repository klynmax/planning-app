export interface PageResult<T> {
  content: T[];
  size: number;
  last: boolean;
  number: number;
  first: boolean;
  totalPages: number;
  totalElements: number;
}
