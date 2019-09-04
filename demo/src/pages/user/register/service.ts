import request from '@/utils/request';
import { UserRegisterParams, CaptchaParams } from './new';

const PREFIX = `/api/v1`;

export async function fakeRegister(params: UserRegisterParams) {
  return request(`${PREFIX}/users`, {
    method: 'POST',
    data: params,
  });
}

export async function fakeCaptcha(params: CaptchaParams) {
  return request(`${PREFIX}/sms_code`, {
    params: params,
  });
}
