import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryMovies, updateMovie, addMovie, removeMovie } from './service';

import { TableListData } from './data.d';

export interface StateType {
  data: TableListData;
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
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    updateMovie: Reducer<StateType>;
    removeMovie: Reducer<StateType>;
    createMovie: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'movies',

  state: {
    data: {
      movies: [],
      page: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMovies, payload);
      yield put({
        type: 'save',
        payload: response.response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      try {
        const response = yield call(addMovie, payload);
        yield put({
          type: 'createMovie',
          payload: response.response,
        });
        callback();
      } catch (e) {
        callback(e.data.message);
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeMovie, payload);
      yield put({
        type: 'removeMovie',
        payload: response.response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      try {
        const response = yield call(updateMovie, payload);
        yield put({
          type: 'updateMovie',
          payload: response.response,
        });
        callback();
      } catch (e) {
        callback(e.data.message);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    createMovie(state, action) {
      return {
        ...state,
        data: {
          ...state!.data,
          movies: [...state!.data!.movies, action.payload.movie],
        },
      };
    },

    updateMovie(state, action) {
      return {
        ...state,
        data: {
          ...state!.data,
          movies: state!.data!.movies!.map(movie => {
            if (movie.id === action.payload.movie.id) {
              return action.payload.movie;
            }
            return movie;
          }),
        },
      };
    },
    removeMovie(state, action) {
      return {
        ...state,
        data: {
          ...state!.data,
          movies: state!.data!.movies.filter(movie => movie.id !== action.payload.movie.id),
        },
      };
    },
  },
};

export default Model;
