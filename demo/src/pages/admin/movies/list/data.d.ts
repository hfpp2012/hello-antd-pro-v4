export interface MovieItem {
  id: number;
  title: string;
  published_at: string;
  playlist_name: string;
  is_paid: boolean;
  weight: number;
  time: string;
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

interface MovieUpdateParams {
  weight: number;
  time: string;
  id: number;
  title: string;
}

export interface MovieCreateParams {
  movie: {
    body: string;
    mp4_url: string;
    time: string;
    title: string;
  };
}

export interface TableListParams {
  sorter: string;
  page: number;
  q: {
    title_cont: string;
  };
  movie: MovieUpdateParams;
}
