import axios from "axios";

export const userSignupRequest = (userData) => {
  return dispatch => {
    return axios.post('/api/users', userData);
  }
};

export const isUserExists = (identifier) => {
  return dispatch => {
    return axios.get(`/api/users/${identifier}`, identifier);
  }
};
