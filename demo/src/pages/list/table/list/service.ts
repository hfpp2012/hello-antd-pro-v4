import request from '@/utils/request';
import { TableListParams } from './data.d';
import { stringify } from 'qs';

export async function queryMovies(params: TableListParams) {
  const query = stringify(params);
  return request(`/movies?${query}`);
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateMovie(params: TableListParams) {
  return request(`/movies/${params.movie.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function removeMovie(params: TableListParams) {
  return request(`/movies/remove`, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
