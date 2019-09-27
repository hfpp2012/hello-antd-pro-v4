import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { Movie } from './data.d';
import { queryMovie } from './service';

export interface StateType {
  movie?: Movie;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'movieShow',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMovie, payload.id);
      yield put({
        type: 'show',
        payload: response.response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
