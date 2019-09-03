import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { fakeRegister, fakeCaptcha } from './service';
import uuidv4 from 'uuid/v4';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
  errors?: any;
  image?: string;
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
  };
}

const Model: ModelType = {
  namespace: 'userRegister',

  state: {
    status: undefined,
    errors: {},
    image: 'http://localhost:5000/rucaptcha',
  },

  effects: {
    *submit({ payload }, { call, put }) {
      try {
        const response = yield call(fakeRegister, payload);
        yield put({
          type: 'registerHandle',
          payload: response,
        });
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
        status: payload.status,
      };
    },
    errorsHandle(state, { payload }) {
      return {
        ...state,
        errors: payload,
      };
    },

    setCaptchaImage(state, {}) {
      const randomString = uuidv4();
      return {
        ...state,
        image: `http://localhost:5000/rucaptcha?a=${randomString}`,
      };
    },
  },
};

export default Model;
