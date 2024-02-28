// reducers.js
import { combineReducers } from 'redux';
import authReducer from './auth.reducer'; // hoặc tên reducer của bạn

const rootReducer = combineReducers({
  auth: authReducer,
  // Thêm các reducer khác nếu cần
});

export default rootReducer;
