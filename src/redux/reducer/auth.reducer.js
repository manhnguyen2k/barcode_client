// authReducer.js
import { SET_LOGIN_STATUS, SET_TOKEN, SET_UID} from '../actions/auth';

const initialState = {
  isLogin: false,
  uid:"",
  token: ""
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN_STATUS:
      return {
        ...state,
        isLogin: action.payload,
      };
      case SET_UID:
        return {
          ...state,
          uid: action.payload,
        };
      case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
