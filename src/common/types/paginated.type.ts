/**
 * 分页元数据
 * Pagination metadata
 */
export interface Pagination {
  /**
   * Current page number (1-indexed)
   * 当前页码
   */
  page: number;

  /**
   * Number of items per page
   * 每页的数据量
   */
  pageSize: number;

  /**
   * Total number of pages available
   * 总页码
   */
  totalPages: number;

  /**
   * Total number of items across all pages
   * 总数据量
   */
  totalItems: number;
}

/**
 * 通用的分页响应包装器
 * Generic paginated response wrapper
 * @template TData - The type of data items in the paginated result
 */
export interface Paginated<TData> {
  /**
   * 当前页码的数据组
   * Array of data items for the current page
   */
  data: TData[];

  /**
   * 页码元数据
   * Pagination metadata
   */
  pagination: Pagination;
}
