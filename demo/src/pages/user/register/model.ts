import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { fakeRegister, fakeCaptcha } from './service';
import uuidv4 from 'uuid/v4';
import { DOMAIN } from '@/utils/request';

export interface StateType {
  success?: boolean;
  currentAuthority?: 'user' | 'guest' | 'admin';
  errors?: any;
  image?: string;
  response?: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
    getCaptcha: Effect;
    onGetCaptchaImage: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
    errorsHandle: Reducer<StateType>;
    setCaptchaImage: Reducer<StateType>;
    clearErrors: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userRegister',

  state: {
    success: false,
    errors: {},
    response: {},
    image: `${DOMAIN}/rucaptcha`,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      try {
        const response = yield call(fakeRegister, payload);
        yield put({
          type: 'registerHandle',
          payload: response,
        });
        yield put({
          type: 'clearErrors',
        });

        localStorage.setItem('token', response.response.auth_token);
      } catch (e) {
        yield put({
          type: 'errorsHandle',
          payload: e.data.errors,
        });

        yield put({
          type: 'onGetCaptchaImage',
        });
      }
    },
    *onGetCaptchaImage({}, { put }) {
      yield put({
        type: 'setCaptchaImage',
      });
    },

    *getCaptcha({ payload }, { call }) {
      yield call(fakeCaptcha, payload);
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        success: payload.success,
        response: payload.response,
      };
    },
    errorsHandle(state, { payload }) {
      return {
        ...state,
        errors: payload,
      };
    },

    clearErrors(state, {}) {
      return {
        ...state,
        errors: {},
      };
    },

    setCaptchaImage(state, {}) {
      const randomString = uuidv4();
      return {
        ...state,
        image: `${DOMAIN}/rucaptcha?a=${randomString}`,
      };
    },
  },
};

export default Model;
