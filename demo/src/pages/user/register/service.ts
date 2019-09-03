import request from '@/utils/request';
import { UserRegisterParams, CaptchaParams } from './new';

export async function fakeRegister(params: UserRegisterParams) {
  return request('/api/v1/users', {
    method: 'POST',
    data: params,
  });
}

export async function fakeCaptcha(params: CaptchaParams) {
  return request('/api/v1/sms_code', {
    params: params,
  });
}
