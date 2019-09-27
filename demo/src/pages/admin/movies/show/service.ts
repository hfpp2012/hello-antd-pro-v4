import request from '@/utils/request';

export async function queryMovie(id: number) {
  return request(`/movies/${id}`);
}
