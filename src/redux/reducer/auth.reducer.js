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
       
        localStorage.setItem("isLogin",action.payload)
      return {
        ...state,
        isLogin: action.payload,
      };
      case SET_UID:
        localStorage.setItem("uid",action.payload)
        return {
          ...state,
          uid: action.payload,
        };
      case SET_TOKEN:
        localStorage.setItem("token",action.payload)
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
