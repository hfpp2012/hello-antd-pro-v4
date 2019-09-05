import request from '@/utils/request';
import { UserRegisterParams, CaptchaParams } from './new';

export async function fakeRegister(params: UserRegisterParams) {
  return request(`/users`, {
    method: 'POST',
    data: params,
  });
}

export async function fakeCaptcha(params: CaptchaParams) {
  return request(`/sms_code`, {
    params: params,
  });
}
