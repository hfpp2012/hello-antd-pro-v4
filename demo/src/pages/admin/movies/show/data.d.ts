export interface MovieItem {
  id: number;
  is_paid: boolean;
  time: string;
  published_at: string;
  playlist_name: string;
  title: string;
}

export interface MovieData {
  movie: MovieItem;
}
