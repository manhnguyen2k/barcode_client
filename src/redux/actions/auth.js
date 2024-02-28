// actions.js
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_UID = 'SET_UID';
export const setLoginStatus = (isLogin) => ({
  type: SET_LOGIN_STATUS,
  payload: isLogin,
});
export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});
export const setUid = (id) => ({
  type: SET_UID,
  payload: id,
});