import request from '@/utils/request';
import { FormDataType } from './index';

export async function fakeAccountLogin(params: FormDataType) {
  return request('/sessions', {
    method: 'POST',
    data: params,
  });
}
