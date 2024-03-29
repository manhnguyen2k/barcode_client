import { SET_LOGIN_STATUS, SET_UID, SET_TOKEN } from './actions/auth';

const saveToLocalStorage = store => next => action => {
  const result = next(action);
  if ([SET_LOGIN_STATUS, SET_UID, SET_TOKEN].includes(action.type)) {
    const { auth } = store.getState();
    localStorage.setItem('reduxState', JSON.stringify({ auth }));
  }
  return result;
};

export default saveToLocalStorage;