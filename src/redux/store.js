
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import saveToLocalStorage from './middlerware';

// Load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const persistedState = loadState();
const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(saveToLocalStorage)
);

export default store;