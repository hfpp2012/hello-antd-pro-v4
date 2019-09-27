export interface Movie {
  id: number;
  is_paid: boolean;
  title: string;
  playlist_name: string;
  published_at: string;
  time: string;
}

export interface BasicProgress {
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
}

export interface BasicProfileDataType {
  basicProgress: BasicProgress[];
}
