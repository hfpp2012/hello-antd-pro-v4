export interface MovieItem {
  id: number;
  title: string;
  published_at: string;
  playlist_name: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface MovieListData {
  movies: MovieItem[];
  page: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
