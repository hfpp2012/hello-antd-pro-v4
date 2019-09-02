import request from '@/utils/request';
import { UserRegisterParams, CaptchaParams } from './new';

export async function fakeRegister(params: UserRegisterParams) {
  return request('http://localhost:5000/api/v1/users', {
    method: 'POST',
    data: params,
  });
}

export async function fakeCaptcha(params: CaptchaParams) {
  return request('http://localhost:5000/api/v1/sms_code', {
    params: params,
  });
}
