export interface TableListItem {
  id: number;
  is_paid?: boolean;
  image_url?: string;
  title: string;
  playlist_name: string;
  created_at: Date;
  published_at: Date;
  weight: number;
  time: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface PlaylistData {
  id: number;
  name: string;
}

export interface TableListData {
  movies: TableListItem[];
  page: Partial<TableListPagination>;
}

interface UpdateMovieParams {
  id: number;
  title: string;
  time: string;
  weight: string;
}

export interface createParams {
  title: string;
  body: string;
  playlist_id: number;
  time: string;
  mp4_url: string;
}

export interface createMovieParms {
  movie: createParams;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  page: number;
  movie: UpdateMovieParams;
}
